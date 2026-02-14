import type { APIRoute } from 'astro';
import { estimateSubmissionSchema } from '../../lib/ai/schemas';
import { generateEstimatePdf } from '../../lib/pdf/generate-pdf';
import {
  sendEstimateEmail,
  sendTeamNotification,
} from '../../lib/email/send-estimate';

// NOTE: インメモリMapはCloudflare Workers環境では単一isolate内でのみ有効。
// 本番環境ではCloudflare Rate Limitingルール（Dashboard or wrangler.toml）を併用すること。
const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

/**
 * IPアドレスベースのレート制限チェック
 * 1IP/1分あたり3回まで
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

/**
 * リクエストからIPアドレスを取得
 */
function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return 'unknown';
}

/**
 * JSONレスポンスを返すヘルパー
 */
function jsonResponse(
  data: unknown,
  status = 200,
  headers: HeadersInit = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. レート制限チェック
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return jsonResponse(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        429
      );
    }

    // 2. リクエストボディをパース
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: 'Invalid JSON format',
        },
        400
      );
    }

    // 3. バリデーション
    const validationResult = estimateSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        400
      );
    }

    const { estimate, contact } = validationResult.data;

    // 4. amountをサーバー側で再計算（AIの計算ミスを防止）
    const correctedLineItems = estimate.lineItems.map((item) => ({
      ...item,
      amount: item.quantity * item.unitPrice,
    }));
    const subtotal = correctedLineItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // 5. PDF生成
    const pdfResult = await generateEstimatePdf({
      lineItems: correctedLineItems,
      contact,
      projectSummary: estimate.projectSummary,
      timeline: estimate.timeline,
      notes: estimate.notes,
    });

    // 6. 環境変数チェック
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const fromEmail = import.meta.env.FROM_EMAIL;
    const teamNotificationEmail = import.meta.env.TEAM_NOTIFICATION_EMAIL;

    if (!resendApiKey || !fromEmail || !teamNotificationEmail) {
      console.error('Missing required environment variables');
      return jsonResponse(
        {
          success: false,
          error: 'Server configuration error',
        },
        500
      );
    }

    const emailEnv = {
      RESEND_API_KEY: resendApiKey,
      FROM_EMAIL: fromEmail,
      TEAM_NOTIFICATION_EMAIL: teamNotificationEmail,
    };

    // 7. メール送信（並行実行）
    await Promise.all([
      sendEstimateEmail({
        to: contact.email,
        name: contact.name,
        pdfBuffer: pdfResult.buffer,
        estimateNumber: pdfResult.estimateNumber,
        env: emailEnv,
      }),
      sendTeamNotification({
        estimate: { ...estimate, lineItems: correctedLineItems },
        contact,
        subtotal,
        estimateNumber: pdfResult.estimateNumber,
        env: emailEnv,
      }),
    ]);

    // 8. 成功レスポンス
    return jsonResponse({
      success: true,
      estimateNumber: pdfResult.estimateNumber,
    });
  } catch (error) {
    console.error('Error in /api/estimate:', error);

    return jsonResponse(
      {
        success: false,
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      500
    );
  }
};
