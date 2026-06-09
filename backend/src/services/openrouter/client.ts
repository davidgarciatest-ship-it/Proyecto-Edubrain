import OpenAI from 'openai';

export const client = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: { 'HTTP-Referer': 'https://edubrain.app', 'X-Title': 'EduBrain' },
});

export const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
