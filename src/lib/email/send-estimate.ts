import { Resend } from 'resend';
import type { EstimateFormData } from '../form-schema';
import type { EstimateResult } from '../estimate-calculator';

interface EmailEnv {
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  TEAM_NOTIFICATION_EMAIL: string;
}

interface SendEstimateEmailParams {
  to: string;
  name: string;
  pdfBuffer: Buffer;
  estimateNumber: string;
  env: EmailEnv;
}

/**
 * ユーザー向け見積もりメール送信
 */
export async function sendEstimateEmail(
  params: SendEstimateEmailParams
): Promise<void> {
  const { to, name, pdfBuffer, estimateNumber, env } = params;

  const resend = new Resend(env.RESEND_API_KEY);

  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 20px;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="logo">Antares</div>

  <p>${name} 様</p>

  <p>お見積もりのご依頼、誠にありがとうございます。</p>

  <div class="content">
    <p>添付のPDFにて概算見積もりをお送りします。</p>
    <p><strong>見積番号:</strong> ${estimateNumber}</p>
  </div>

  <p>
    ※ こちらは概算見積もりとなります。<br>
    詳細なヒアリングを行った上で、正式なお見積もりをご提示させていただきます。
  </p>

  <p>
    ご不明な点やご質問がございましたら、お気軽にこのメールにご返信ください。<br>
    担当者より速やかにご対応させていただきます。
  </p>

  <div class="footer">
    <p>
      <strong>Antares</strong><br>
      AI開発で、圧倒的なコスト削減を実現。<br>
      最先端のAI技術を活用し、高品質なシステム開発をリーズナブルな価格でご提供します。
    </p>
  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: env.FROM_EMAIL,
    to,
    subject: `【Antares】お見積書をお送りします（${estimateNumber}）`,
    html: htmlBody,
    attachments: [
      {
        filename: `estimate-${estimateNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

interface SendTeamNotificationParams {
  data: EstimateFormData;
  estimate: EstimateResult;
  estimateNumber: string;
  env: EmailEnv;
}

/**
 * チーム通知メール送信
 */
export async function sendTeamNotification(
  params: SendTeamNotificationParams
): Promise<void> {
  const { data, estimate, estimateNumber, env } = params;

  const resend = new Resend(env.RESEND_API_KEY);

  const formatCurrency = (amount: number): string => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #3b82f6;
      color: white;
      padding: 15px 20px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 10px;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 5px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      min-width: 150px;
      font-weight: bold;
      color: #6b7280;
    }
    .info-value {
      flex: 1;
    }
    .estimate-range {
      background-color: #dbeafe;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
      margin: 15px 0;
    }
    .features-list {
      list-style: none;
      padding: 0;
    }
    .features-list li {
      padding: 5px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .features-list li:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin: 0;">新規見積もりリクエスト</h2>
    <p style="margin: 5px 0 0 0; font-size: 14px;">見積番号: ${estimateNumber}</p>
  </div>

  <div class="content">
    <div class="section">
      <div class="section-title">顧客情報</div>
      ${data.contact.company ? `
      <div class="info-row">
        <span class="info-label">会社名</span>
        <span class="info-value">${data.contact.company}</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="info-label">担当者名</span>
        <span class="info-value">${data.contact.name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">メールアドレス</span>
        <span class="info-value">${data.contact.email}</span>
      </div>
      ${data.contact.phone ? `
      <div class="info-row">
        <span class="info-label">電話番号</span>
        <span class="info-value">${data.contact.phone}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">プロジェクト情報</div>
      <div class="info-row">
        <span class="info-label">システム種別</span>
        <span class="info-value">${data.systemType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">規模</span>
        <span class="info-value">${data.scale}</span>
      </div>
      <div class="info-row">
        <span class="info-label">希望納期</span>
        <span class="info-value">${data.timeline}</span>
      </div>
      ${data.features.length > 0 ? `
      <div class="info-row" style="align-items: flex-start; margin-top: 10px;">
        <span class="info-label">選択機能</span>
        <ul class="features-list" style="margin: 0; flex: 1;">
          ${data.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">概算見積金額</div>
      <div class="estimate-range">
        ${formatCurrency(estimate.min)} 〜 ${formatCurrency(estimate.max)}
      </div>
      <div style="font-size: 12px; color: #6b7280;">
        <p>内訳:</p>
        <ul style="margin: 5px 0; padding-left: 20px;">
          <li>基本料金: ${formatCurrency(estimate.breakdown.baseCost)}</li>
          <li>規模係数: ${estimate.breakdown.scaleFactor}</li>
          <li>機能追加: ${formatCurrency(estimate.breakdown.featuresCost)}</li>
          <li>納期係数: ${estimate.breakdown.timelineFactor}</li>
          <li>小計: ${formatCurrency(estimate.breakdown.subtotal)}</li>
        </ul>
      </div>
    </div>

    ${data.contact.message ? `
    <div class="section">
      <div class="section-title">お問い合わせ内容</div>
      <div style="background-color: white; padding: 15px; border-radius: 6px; white-space: pre-wrap;">
        ${data.contact.message}
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: env.FROM_EMAIL,
    to: env.TEAM_NOTIFICATION_EMAIL,
    subject: `[新規見積] ${estimateNumber} - ${data.contact.name} 様`,
    html: htmlBody,
  });
}
