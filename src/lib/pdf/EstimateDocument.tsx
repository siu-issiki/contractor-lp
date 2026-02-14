import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { EstimateFormData } from '../form-schema';
import type { EstimateResult } from '../estimate-calculator';
import { SYSTEM_TYPES, SCALES, FEATURES, TIMELINES } from '../constants';

// 日本語フォントの登録（Google Fonts CDN）
Font.register({
  family: 'Noto Sans JP',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.1.1/files/noto-sans-jp-japanese-400-normal.woff',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.1.1/files/noto-sans-jp-japanese-700-normal.woff',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Noto Sans JP',
    fontSize: 10,
  },
  header: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metaInfo: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1pt solid #3b82f6',
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    width: 100,
    fontSize: 9,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    borderTop: '1pt solid #3b82f6',
    borderBottom: '1pt solid #3b82f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 9,
  },
  itemCol: {
    width: '60%',
  },
  amountCol: {
    width: '40%',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: '2pt solid #3b82f6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fffbeb',
    borderLeft: '3pt solid #fbbf24',
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
  },
});

interface EstimateDocumentProps {
  data: EstimateFormData;
  estimate: EstimateResult;
  estimateNumber: string;
  issueDate: string;
}

export const EstimateDocument: React.FC<EstimateDocumentProps> = ({
  data,
  estimate,
  estimateNumber,
  issueDate,
}) => {
  const systemType = SYSTEM_TYPES.find((s) => s.id === data.systemType);
  const scale = SCALES.find((s) => s.id === data.scale);
  const timeline = TIMELINES.find((t) => t.id === data.timeline);
  const selectedFeatures = data.features
    .map((fId) => FEATURES.find((f) => f.id === fId))
    .filter((f): f is typeof FEATURES[number] => f !== undefined);

  const formatCurrency = (amount: number): string => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.logo}>Antares</Text>
          <Text style={styles.title}>見積書</Text>
          <Text style={styles.metaInfo}>発行日: {issueDate}</Text>
          <Text style={styles.metaInfo}>見積番号: {estimateNumber}</Text>
        </View>

        {/* 顧客情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>お客様情報</Text>
          {data.contact.company && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>会社名</Text>
              <Text style={styles.infoValue}>{data.contact.company}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>担当者名</Text>
            <Text style={styles.infoValue}>{data.contact.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>メールアドレス</Text>
            <Text style={styles.infoValue}>{data.contact.email}</Text>
          </View>
          {data.contact.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>電話番号</Text>
              <Text style={styles.infoValue}>{data.contact.phone}</Text>
            </View>
          )}
        </View>

        {/* 見積内訳 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>見積内訳</Text>

          <View style={styles.table}>
            {/* テーブルヘッダー */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.itemCol]}>項目</Text>
              <Text style={[styles.tableHeaderCell, styles.amountCol]}>金額</Text>
            </View>

            {/* システム種類 */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.itemCol]}>
                {systemType?.icon} {systemType?.label}（基本料金）
              </Text>
              <Text style={[styles.tableCell, styles.amountCol]}>
                {formatCurrency(estimate.breakdown.baseCost)}
              </Text>
            </View>

            {/* 規模係数 */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.itemCol]}>
                規模: {scale?.label} ({scale?.description}) × {scale?.factor}
              </Text>
              <Text style={[styles.tableCell, styles.amountCol]}>
                {formatCurrency(estimate.breakdown.baseCost * estimate.breakdown.scaleFactor)}
              </Text>
            </View>

            {/* 選択機能 */}
            {selectedFeatures.map((feature) => (
              <View key={feature.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.itemCol]}>
                  機能: {feature.label}
                </Text>
                <Text style={[styles.tableCell, styles.amountCol]}>
                  +{formatCurrency(feature.cost)}
                </Text>
              </View>
            ))}

            {/* 納期係数 */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.itemCol]}>
                納期: {timeline?.label} × {timeline?.factor}
              </Text>
              <Text style={[styles.tableCell, styles.amountCol]}>
                係数適用済み
              </Text>
            </View>

            {/* 小計 */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.itemCol, { fontWeight: 'bold' }]}>
                小計
              </Text>
              <Text style={[styles.tableCell, styles.amountCol, { fontWeight: 'bold' }]}>
                {formatCurrency(estimate.breakdown.subtotal)}
              </Text>
            </View>
          </View>

          {/* 合計金額レンジ */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>お見積金額（概算）</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(estimate.min)} 〜 {formatCurrency(estimate.max)}
              </Text>
            </View>
          </View>
        </View>

        {/* 備考 */}
        <View style={styles.notes}>
          <Text style={styles.notesText}>
            ※ 本見積もりは概算です。詳細なヒアリング後に正式なお見積もりをお出しします。
          </Text>
          <Text style={styles.notesText}>
            ※ 実際の開発内容や要件によって金額は変動する可能性があります。
          </Text>
          {data.contact.message && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.notesText, { fontWeight: 'bold' }]}>
                お問い合わせ内容:
              </Text>
              <Text style={styles.notesText}>{data.contact.message}</Text>
            </View>
          )}
        </View>

        {/* フッター */}
        <Text style={styles.footer}>
          Antares - AI開発で、圧倒的なコスト削減を実現。
        </Text>
      </Page>
    </Document>
  );
};
