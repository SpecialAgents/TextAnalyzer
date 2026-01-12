
export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface SentimentResult {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  explanation: string;
  manualLabel?: Sentiment;
}

export interface ComparisonMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    [key in Sentiment]: { [key in Sentiment]: number };
  };
}

export type View = 'LANDING' | 'DASHBOARD' | 'REPORT' | 'DOCS';
