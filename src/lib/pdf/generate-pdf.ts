import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { EstimateDocument } from './EstimateDocument';
import type { EstimateFormData } from '../form-schema';
import type { EstimateResult } from '../estimate-calculator';

/**
 * 見積番号を生成
 * 形式: EST-YYYYMMDD-XXXXX (Xはランダム5桁)
 */
function generateEstimateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  return `EST-${year}${month}${day}-${random}`;
}

/**
 * 発行日をフォーマット
 * 形式: YYYY年MM月DD日
 */
function formatIssueDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

export interface GeneratePdfOptions {
  data: EstimateFormData;
  estimate: EstimateResult;
}

export interface GeneratePdfResult {
  buffer: Buffer;
  estimateNumber: string;
  issueDate: string;
}

/**
 * 見積書PDFを生成
 */
export async function generateEstimatePdf(
  options: GeneratePdfOptions
): Promise<GeneratePdfResult> {
  const { data, estimate } = options;

  const estimateNumber = generateEstimateNumber();
  const issueDate = formatIssueDate(new Date());

  // React要素を作成
  const element = React.createElement(EstimateDocument, {
    data,
    estimate,
    estimateNumber,
    issueDate,
  });

  // PDFバッファを生成
  const buffer = await renderToBuffer(element);

  return {
    buffer,
    estimateNumber,
    issueDate,
  };
}
