
import { Sentiment } from './types';

/**
 * Professional Forest & Slate Palette:
 * Primary: #064e3b (Dark Green)
 * Secondary: #10b981 (Emerald)
 * Deep: #022c22 (Deepest Green)
 * Surface: #f8fafc (Slate 50 / Light Grey)
 * Border: #e2e8f0 (Slate 200)
 */
export const BRAND_COLORS = {
  PRIMARY: '#064e3b',
  SECONDARY: '#10b981',
  DEEP: '#022c22',
  BG: '#FFFFFF',
  SURFACE: '#f8fafc',
  TEXT: '#0f172a',
  SOFT_GREY: '#f1f5f9',
};

export const SENTIMENT_COLORS = {
  [Sentiment.POSITIVE]: '#10b981', // Emerald Green
  [Sentiment.NEGATIVE]: '#be123c', // Deep Rose
  [Sentiment.NEUTRAL]: '#64748b',  // Slate Grey
};

export const SAMPLE_TEXTS = [
  "This experience was transformative! The attention to detail is truly world-class.",
  "I'm quite frustrated with the lack of transparency in the recent updates.",
  "The service is functional. It meets the basic requirements but lacks flair.",
  "Incredible work! The team really went above and beyond my expectations.",
  "A total waste of time. The interface is clunky and the results are inaccurate."
];
