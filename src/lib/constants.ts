export const SYSTEM_TYPES = [
  { id: 'web_app', label: 'Webアプリ', icon: '🌐', baseCost: 1_000_000 },
  { id: 'business_system', label: '業務システム', icon: '🏢', baseCost: 1_500_000 },
  { id: 'mobile_app', label: 'モバイルアプリ', icon: '📱', baseCost: 1_200_000 },
  { id: 'lp_website', label: 'LP / Webサイト', icon: '🖥️', baseCost: 400_000 },
  { id: 'other', label: 'その他', icon: '💡', baseCost: 800_000 },
] as const;

export type SystemTypeId = (typeof SYSTEM_TYPES)[number]['id'];

export const SCALES = [
  { id: 'small', label: '小規模', description: 'シンプルな機能のみ', factor: 1.0 },
  { id: 'medium', label: '中規模', description: '複数の主要機能あり', factor: 2.0 },
  { id: 'large', label: '大規模', description: '多機能・複雑な要件', factor: 3.5 },
  { id: 'enterprise', label: 'エンタープライズ', description: '大規模・高可用性要件', factor: 6.0 },
] as const;

export type ScaleId = (typeof SCALES)[number]['id'];

export const FEATURES = [
  { id: 'auth', label: 'ユーザー認証', cost: 200_000 },
  { id: 'payment', label: '決済機能', cost: 400_000 },
  { id: 'admin', label: '管理画面', cost: 300_000 },
  { id: 'notification', label: '通知機能', cost: 150_000 },
  { id: 'search', label: '検索機能', cost: 200_000 },
  { id: 'analytics', label: '分析ダッシュボード', cost: 350_000 },
  { id: 'chat', label: 'チャット・メッセージ', cost: 300_000 },
  { id: 'file_upload', label: 'ファイルアップロード', cost: 150_000 },
  { id: 'api_integration', label: '外部API連携', cost: 250_000 },
  { id: 'multilingual', label: '多言語対応', cost: 200_000 },
] as const;

export type FeatureId = (typeof FEATURES)[number]['id'];

export const TIMELINES = [
  { id: 'asap', label: 'なるべく早く', description: '最短納期', factor: 1.3 },
  { id: '1month', label: '1ヶ月以内', description: '', factor: 1.1 },
  { id: '3months', label: '3ヶ月以内', description: '', factor: 1.0 },
  { id: '6months', label: '6ヶ月以内', description: '', factor: 0.9 },
  { id: 'flexible', label: '柔軟に対応可能', description: 'スケジュール調整可', factor: 0.85 },
] as const;

export type TimelineId = (typeof TIMELINES)[number]['id'];
