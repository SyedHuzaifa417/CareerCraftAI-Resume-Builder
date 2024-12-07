"use server"; //5:34

// import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/db";
// import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveResume(values: ResumeValues) {
  const { id } = values;

  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  //   const subscriptionLevel = await getUserSubscriptionLevel(userId);

  //   if (!id) {
  //     const resumeCount = await prisma.resume.count({ where: { userId } });

  //     if (!canCreateResume(subscriptionLevel, resumeCount)) {
  //       throw new Error(
  //         "Maximum resume count reached for this subscription level",
  //       );
  //     }
  //   }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  //   const hasCustomizations =
  //     (resumeValues.borderStyle &&
  //       resumeValues.borderStyle !== existingResume?.borderStyle) ||
  //     (resumeValues.colorHex &&
  //       resumeValues.colorHex !== existingResume?.colorHex);

  //   if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
  //     throw new Error("Customizations not allowed for this subscription level");
  //   }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    // If there's an existing photo, delete it from Cloudinary
    if (existingResume?.photoUrl) {
      try {
        // Extract public ID from the existing Cloudinary URL
        const publicId = existingResume.photoUrl
          .split("/")
          .pop()
          ?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("Error deleting existing photo:", error);
      }
    }

    // Upload new photo to Cloudinary
    try {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<{ url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "resume_photos",
                resource_type: "image",
                overwrite: true,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve({ url: result!.secure_url });
              },
            )
            .end(buffer);
        },
      );

      newPhotoUrl = uploadResult.url;
    } catch (error) {
      console.error("Photo upload error:", error);
      throw new Error("Failed to upload photo");
    }
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      try {
        const publicId = existingResume.photoUrl
          .split("/")
          .pop()
          ?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }

    newPhotoUrl = null;
  }

  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}
