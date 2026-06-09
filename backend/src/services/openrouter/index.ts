import OpenAI from 'openai';
import { client, MODEL } from './client';
import { buildSystemPrompt } from './prompts';
import { executeTool } from './executors';
import { tools } from './tools';
import type { UserProfile } from '../../types/index';

export async function processChatMessage(message: string, sessionId: string, profile?: UserProfile): Promise<string> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt(profile) },
    { role: 'user', content: message },
  ];
  let finalReply = '';
  let remainingRounds = 2;
  while (remainingRounds > 0) {
    remainingRounds--;
    const response = await client.chat.completions.create({ model: MODEL, messages, tools, tool_choice: 'auto' });
    const replyMessage = response.choices[0].message;
    if (!replyMessage.tool_calls || replyMessage.tool_calls.length === 0) {
      finalReply = replyMessage.content || '';
      break;
    }
    messages.push(replyMessage);
    for (const toolCall of replyMessage.tool_calls) {
      messages.push(executeTool(toolCall, sessionId));
    }
  }
  if (!finalReply) {
    const finalResponse = await client.chat.completions.create({ model: MODEL, messages });
    finalReply = finalResponse.choices[0].message.content || '';
  }
  return finalReply;
}
