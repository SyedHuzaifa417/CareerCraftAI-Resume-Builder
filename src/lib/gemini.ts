"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateSummaryInput, generateSummarySchema } from "./validation";

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

export async function generateSummary(input: GenerateSummaryInput) {
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
