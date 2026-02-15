import type { APIRoute } from 'astro';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { z } from 'zod';

const MAX_REQUESTS_PER_MINUTE = 10;

const suggestBodySchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).min(1),
});

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((s) => typeof s === 'string');
}

async function checkRateLimit(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
  if (!kv) return true;
  try {
    const window = Math.floor(Date.now() / 60000);
    const key = `rl:suggest:${ip}:${window}`;
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
  const emptyResponse = () =>
    new Response(JSON.stringify({ suggestions: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  try {
    const kv = locals?.runtime?.env?.RATE_LIMIT;
    const clientIp = getClientIp(request);
    if (!await checkRateLimit(kv, clientIp)) {
      return emptyResponse();
    }

    const body: unknown = await request.json();
    const parsed = suggestBodySchema.safeParse(body);
    if (!parsed.success) {
      return emptyResponse();
    }
    const { messages } = parsed.data;

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('Missing ANTHROPIC_API_KEY');
      return emptyResponse();
    }

    const anthropic = createAnthropic({ apiKey });

    const recentMessages = messages.slice(-4);

    const result = await generateText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: `あなたはシステム開発の見積もりチャットのサジェストボタンを生成するアシスタントです。
直近の会話を見て、ユーザーが次に回答しそうな選択肢を2〜4個生成してください。
各選択肢は短い日本語フレーズ（10〜30文字程度）にしてください。
JSON配列のみを返してください。例: ["選択肢1", "選択肢2", "選択肢3"]`,
      messages: recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      maxTokens: 150,
    });

    const text = result.text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return emptyResponse();
    }

    const rawSuggestions: unknown = JSON.parse(jsonMatch[0]);
    if (!isStringArray(rawSuggestions)) {
      return emptyResponse();
    }

    return new Response(JSON.stringify({ suggestions: rawSuggestions.slice(0, 4) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/suggest:', error);
    return emptyResponse();
  }
};
