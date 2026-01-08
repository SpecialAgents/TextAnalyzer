
export enum Sentiment {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral'
}

export interface AnalysisResult {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  explanation: string;
  timestamp: string;
  source: string;
}

export interface SentimentDistribution {
  name: string;
  value: number;
  color: string;
}

export interface AccuracyMetric {
  label: string;
  value: number;
}

export interface ConfusionMatrixData {
  actual: Sentiment;
  predicted: Sentiment;
  count: number;
}

export interface BatchAnalysisResponse {
  results: Array<{
    text: string;
    sentiment: Sentiment;
    confidence: number;
    keywords: string[];
    explanation: string;
  }>;
}
