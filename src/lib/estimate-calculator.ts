import { SYSTEM_TYPES, SCALES, FEATURES, TIMELINES } from './constants';
import type { EstimateFormData } from './form-schema';

export interface EstimateResult {
  min: number;
  max: number;
  breakdown: {
    baseCost: number;
    scaleFactor: number;
    featuresCost: number;
    timelineFactor: number;
    subtotal: number;
  };
}

export function calculateEstimate(data: EstimateFormData): EstimateResult {
  const systemType = SYSTEM_TYPES.find((s) => s.id === data.systemType);
  const scale = SCALES.find((s) => s.id === data.scale);
  const timeline = TIMELINES.find((t) => t.id === data.timeline);

  if (!systemType || !scale || !timeline) {
    throw new Error('Invalid form data');
  }

  const baseCost = systemType.baseCost;
  const scaleFactor = scale.factor;
  const featuresCost = data.features.reduce((sum, featureId) => {
    const feature = FEATURES.find((f) => f.id === featureId);
    return sum + (feature?.cost ?? 0);
  }, 0);
  const timelineFactor = timeline.factor;

  const subtotal = (baseCost * scaleFactor + featuresCost) * timelineFactor;

  const min = Math.round(subtotal * 0.8);
  const max = Math.round(subtotal * 1.2);

  return {
    min,
    max,
    breakdown: {
      baseCost,
      scaleFactor,
      featuresCost,
      timelineFactor,
      subtotal: Math.round(subtotal),
    },
  };
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}
