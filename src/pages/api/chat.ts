import type { APIRoute } from 'astro';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';
import { estimateTools } from '../../lib/ai/tools';
import { SYSTEM_PROMPT } from '../../lib/ai/system-prompt';

const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_MESSAGES = 20;

async function checkRateLimit(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
  if (!kv) return true;
  try {
    const window = Math.floor(Date.now() / 60000);
    const key = `rl:chat:${ip}:${window}`;
    const count = parseInt(await kv.get(key) ?? '0', 10);
    if (count >= MAX_REQUESTS_PER_MINUTE) return false;
    await kv.put(key, String(count + 1), { expirationTtl: 120 });
    return true;
  } catch { return true; }
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return 'unknown';
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const kv = locals?.runtime?.env?.RATE_LIMIT;
    const clientIp = getClientIp(request);
    if (!await checkRateLimit(kv, clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: 'Invalid or too many messages.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('Missing ANTHROPIC_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const anthropic = createAnthropic({ apiKey });

    const modelMessages = await convertToModelMessages(messages, {
      tools: estimateTools,
    });

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: estimateTools,
      maxSteps: 3,
      maxTokens: 1024,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
