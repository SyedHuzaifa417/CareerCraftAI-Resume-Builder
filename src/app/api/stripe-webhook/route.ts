import { env } from "@/env";
import prisma from "@/lib/db";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";
///  9:46
export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET, //to acess the secret key 1.yt 2. the secret key is in webhook then look for signing secret after creating webhook
    );

    console.log(`Received event: ${event.type}`, event.data.object);

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  try {
    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      privateMetadata: {
        stripeCustomerId: session.customer as string,
      },
    });
  } catch (error) {
    // Log the error and potentially handle cases where the customer doesn't exist
    console.error("Error updating user metadata:", error);
  }
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "past_due"
    ) {
      await prisma.userSubscription.upsert({
        where: {
          userId: subscription.metadata.userId,
        },
        create: {
          userId: subscription.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
          stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        update: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
          stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    } else {
      await prisma.userSubscription.deleteMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
      });
    }
  } catch (error) {
    // Handle cases where the customer or subscription might not exist
    console.error("Error handling subscription:", error);

    // If it's a "No such customer" error, you might want to clean up related records
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      // Optionally remove related database records
      await prisma.userSubscription.deleteMany({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
      });
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });
}
