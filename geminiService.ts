
import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment, SentimentResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the sentiment of the following text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
            description: "The primary sentiment of the text."
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score between 0 and 1."
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of key words driving the sentiment."
          },
          explanation: {
            type: Type.STRING,
            description: "Brief explanation of why this sentiment was chosen."
          }
        },
        required: ["sentiment", "confidence", "keywords", "explanation"]
      }
    }
  });

  const rawJson = JSON.parse(response.text || '{}');
  return {
    id: Math.random().toString(36).substring(7),
    text,
    sentiment: rawJson.sentiment as Sentiment,
    confidence: rawJson.confidence,
    keywords: rawJson.keywords || [],
    explanation: rawJson.explanation || ""
  };
};

export const batchAnalyzeSentiment = async (texts: string[]): Promise<SentimentResult[]> => {
  // Processing one by one to ensure reliability in demo, but usually would batch in a single prompt for efficiency
  const results = await Promise.all(texts.map(text => analyzeSentiment(text)));
  return results;
};
