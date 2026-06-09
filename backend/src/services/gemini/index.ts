import { genAI, GEMINI_MODEL } from './client';
import { buildSystemPrompt } from './prompts';
import { executeTool } from './executors';
import { GEMINI_TOOLS } from './tools';
import type { UserProfile } from '../../types/index';

export async function processChatMessage(message: string, sessionId: string, profile?: UserProfile): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: buildSystemPrompt(profile),
    tools: [{ functionDeclarations: GEMINI_TOOLS }],
  });

  const chat = model.startChat();
  let result = await chat.sendMessage(message);
  let response = result.response;
  let finalReply = '';
  let remainingRounds = 2;

  while (remainingRounds > 0) {
    remainingRounds--;
    const functionCalls = response.functionCalls();
    if (!functionCalls || functionCalls.length === 0) {
      finalReply = response.text();
      break;
    }
    const functionResponses = functionCalls.map(fc => ({
      functionResponse: { name: fc.name, response: executeTool(fc.name, fc.args as Record<string, unknown>, sessionId) },
    }));
    result = await chat.sendMessage(functionResponses);
    response = result.response;
  }
  if (!finalReply) {
    finalReply = response.text();
  }
  return finalReply;
}
