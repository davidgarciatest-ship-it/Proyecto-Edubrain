import OpenAI from 'openai';
import { habitTools } from './tools-habits';
import { profileTools } from './tools-profile';

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [...habitTools, ...profileTools];
