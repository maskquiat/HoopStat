
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function parseSchedule(imageData: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: imageData.split(',')[1],
          },
        },
        {
          text: "Extract the basketball game schedule from this image. Provide a list of games including date, opponent, and time if available. Return only valid JSON.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          games: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                opponent: { type: Type.STRING },
                time: { type: Type.STRING },
              },
              required: ['date', 'opponent']
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
