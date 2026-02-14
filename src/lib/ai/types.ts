export interface AILineItem {
  item: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface AIEstimateData {
  projectSummary: string;
  lineItems: AILineItem[];
  timeline: string;
  notes?: string;
}

export interface ContactInfo {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface EstimatePdfData {
  lineItems: AILineItem[];
  subtotal: number;
  tax: number;
  totalWithTax: number;
  projectSummary: string;
  timeline: string;
  notes?: string;
  contact: ContactInfo;
  estimateNumber: string;
  issueDate: string;
  validUntil: string;
}
