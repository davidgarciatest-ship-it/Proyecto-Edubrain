import type { FunctionDeclaration } from '@google/generative-ai';
import { habitTools } from './tools-habits';
import { profileTools } from './tools-profile';

export const GEMINI_TOOLS: FunctionDeclaration[] = [...habitTools, ...profileTools];
