import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const callGeminiImageModel = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const images: string[] = [];
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        images.push(part.inlineData.data);
      }
    }

    if (images.length === 0) {
      throw new Error("The AI did not return an image.");
    }
    
    return images[0];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};


export const generateDjOverlay = async (prompt: string): Promise<string> => {
  return callGeminiImageModel(prompt);
};

export const generateFlyer = async (promptForFlyer: string): Promise<string> => {
  return callGeminiImageModel(promptForFlyer);
};

export const removeImageBackground = async (
  base64Image: string
): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Image,
            },
        };
        const textPart = { text: "Remove the background completely from this image. The new background must be 100% transparent." };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const images: string[] = [];
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                images.push(part.inlineData.data);
            }
        }

        if (images.length === 0) {
            throw new Error("The AI did not return an image after background removal.");
        }

        return images[0];
    } catch (error) {
        console.error("Error removing image background:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to remove background: ${error.message}`);
        }
        throw new Error("An unknown error occurred while removing the background.");
    }
};