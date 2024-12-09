"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "./validation";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "./subscription";
import { canUseAITools } from "./permissions";

const apiKey = process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
//9:37
export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  const subscriptionLevel = await getUserSubscriptionLevel(userId); //since this is the server component so we can directly call subscription from db

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error(
      "AI tools not available for this subscription level,Please upgrade",
    );
  }
  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
  `;

  const userMessage = [
    {
      text: `
        Please generate a professional resume summary from this data:
        Job title: ${jobTitle || "N/A"}
        Work experience:
        ${workExperiences
          ?.map(
            (exp) => `
            Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}
            Description:
            ${exp.description || "N/A"}
          `,
          )
          .join("\n\n")}
        Education:
        ${educations
          ?.map(
            (edu) => `
            Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
          `,
          )
          .join("\n\n")}
        Skills:
        ${skills}
      `,
    },
  ];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: userMessage,
      },
      {
        role: "model",
        parts: [{ text: systemMessage }],
      },
    ],
  });

  const aiResponse = (
    await chatSession.sendMessage(userMessage)
  ).response.text();

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  const subscriptionLevel = await getUserSubscriptionLevel(userId); //since this is the server component so we can directly call subscription from db

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error(
      "AI tools not available for this subscription level,Please upgrade",
    );
  }
  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
 You are a professional resume generator AI. Generate a structured work experience entry based on the user's description.
  
  Your response MUST be in EXACTLY this format with NO additional text:
  Job title: [Job Title]
  Company: [Company Name]
  Start date: [YYYY-MM-DD or empty]
  End date: [YYYY-MM-DD or empty]
  Description: [4 points of only Detailed description in • bullet points without commentry or additional text or suggestions, if information is not sufficient , improvise using provided information]
  
  If any information is missing or unclear, use best judgment to infer or leave empty.`;

  const userMessage = [
    {
      text: `
    Please provide a work experience entry from this description:
    ${description}
    `,
    },
  ];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: userMessage,
      },
      {
        role: "model",
        parts: [{ text: systemMessage }],
      },
    ],
  });

  const aiResponse = (
    await chatSession.sendMessage(userMessage)
  ).response.text();

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }
  console.log("aiResponse", aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    // city: aiResponse.match(/City: (.*)/)?.[1] || "",
    // country: aiResponse.match(/Country: (.*)/)?.[1] || "",
  } satisfies WorkExperience; //this is regex matches destructure written with help of chatgpt
}
