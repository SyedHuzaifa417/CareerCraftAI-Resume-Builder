"use client";

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCheckoutSession } from "./actions";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = [
  "AI tools",
  "Infinite resumes",
  "Design customizations",
];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    //8:51
    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Buy Subscription To Unlock
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a premium subscription to unlock more features.</p>
          <div className="flex space-x-6">
            {/* Premium Column */}
            <div className="flex w-1/2 flex-col">
              <h3 className="mb-4 text-center text-lg font-bold">Premium</h3>
              <ul className="mb-4 flex-grow list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Get Premium
              </Button>
            </div>

            {/* Separator */}
            <div className="border-l" />

            {/* Premium Plus Column */}
            <div className="flex w-1/2 flex-col">
              <h3 className="mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <ul className="mb-4 flex-grow list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="premium"
                className="w-full"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
