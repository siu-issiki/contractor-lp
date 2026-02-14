import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { EstimateDocument } from './EstimateDocument';
import type { AILineItem, ContactInfo, EstimatePdfData } from '../ai/types';

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
  lineItems: AILineItem[];
  contact: ContactInfo;
  projectSummary: string;
  timeline: string;
  notes?: string;
}

export interface GeneratePdfResult {
  buffer: Buffer;
  estimateNumber: string;
  issueDate: string;
  validUntil: string;
}

/**
 * 見積書PDFを生成
 */
export async function generateEstimatePdf(
  options: GeneratePdfOptions
): Promise<GeneratePdfResult> {
  const { lineItems, contact, projectSummary, timeline, notes } = options;

  const estimateNumber = generateEstimateNumber();
  const now = new Date();
  const issueDate = formatIssueDate(now);
  const validUntilDate = new Date(now);
  validUntilDate.setMonth(validUntilDate.getMonth() + 1);
  const validUntil = formatIssueDate(validUntilDate);

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = Math.round(subtotal * 0.1);
  const totalWithTax = subtotal + tax;

  const pdfData: EstimatePdfData = {
    lineItems,
    subtotal,
    tax,
    totalWithTax,
    projectSummary,
    timeline,
    notes,
    contact,
    estimateNumber,
    issueDate,
    validUntil,
  };

  const element = React.createElement(EstimateDocument, { pdfData });
  const buffer = await renderToBuffer(element);

  return {
    buffer,
    estimateNumber,
    issueDate,
    validUntil,
  };
}
