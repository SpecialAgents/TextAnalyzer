
import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment, AnalysisResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export class GeminiService {
  private static instance: GeminiService;
  private ai: any;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async analyzeText(text: string, source: string = "Direct Entry"): Promise<AnalysisResult> {
    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the sentiment of the following text and return a JSON object with: 
      - sentiment: strictly one of "Positive", "Negative", or "Neutral"
      - confidence: a float between 0 and 1
      - keywords: an array of strings representing the main sentiment drivers
      - explanation: a brief one-sentence explanation of why this sentiment was chosen.
      
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
          },
          required: ["sentiment", "confidence", "keywords", "explanation"],
        },
      },
    });

    const data = JSON.parse(response.text.trim());
    return {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sentiment: data.sentiment as Sentiment,
      confidence: data.confidence,
      keywords: data.keywords,
      explanation: data.explanation,
      timestamp: new Date().toISOString(),
      source,
    };
  }

  public async analyzeBatch(texts: string[], source: string = "Batch Upload"): Promise<AnalysisResult[]> {
    // Process in batches of 5 to avoid prompt overflow and handle rate limits gracefully
    const results: AnalysisResult[] = [];
    const chunkSize = 5;
    
    for (let i = 0; i < texts.length; i += chunkSize) {
      const chunk = texts.slice(i, i + chunkSize);
      const prompt = `Analyze the sentiment of these ${chunk.length} texts separately. Return an array of objects.
      Each object must have: sentiment (Positive/Negative/Neutral), confidence (0-1), keywords (array), and explanation.
      
      Texts:
      ${chunk.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}`;

      const response = await this.ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING },
              },
              required: ["sentiment", "confidence", "keywords", "explanation"],
            },
          },
        },
      });

      const chunkResults = JSON.parse(response.text.trim());
      chunkResults.forEach((res: any, idx: number) => {
        results.push({
          id: Math.random().toString(36).substr(2, 9),
          text: chunk[idx],
          sentiment: res.sentiment as Sentiment,
          confidence: res.confidence,
          keywords: res.keywords,
          explanation: res.explanation,
          timestamp: new Date().toISOString(),
          source,
        });
      });
    }

    return results;
  }
}
