import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { EstimatePdfData } from '../ai/types';

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

const colors = {
  black: '#333',
  gray: '#555',
  lightGray: '#ccc',
  white: '#fff',
  tableBg: '#f5f5f5',
};

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontFamily: 'Noto Sans JP',
    fontSize: 10,
    color: colors.black,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 12,
    paddingBottom: 6,
    borderBottom: `2pt solid ${colors.black}`,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    width: '50%',
  },
  headerRight: {
    width: '40%',
    alignItems: 'flex-end',
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    borderBottom: `1pt solid ${colors.black}`,
    paddingBottom: 4,
  },
  clientSub: {
    fontSize: 10,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 8,
    color: colors.gray,
    marginBottom: 2,
    textAlign: 'right',
  },
  totalBox: {
    border: `2pt solid ${colors.black}`,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalBoxLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalBoxAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalBoxTax: {
    fontSize: 8,
    color: colors.gray,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  metaLabel: {
    width: 80,
    fontSize: 9,
    color: colors.gray,
  },
  metaValue: {
    fontSize: 9,
  },
  metaSection: {
    marginBottom: 16,
  },
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.tableBg,
    borderTop: `1pt solid ${colors.black}`,
    borderBottom: `1pt solid ${colors.black}`,
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `0.5pt solid ${colors.lightGray}`,
    paddingVertical: 5,
  },
  tableSummaryRow: {
    flexDirection: 'row',
    borderBottom: `0.5pt solid ${colors.lightGray}`,
    paddingVertical: 5,
    backgroundColor: colors.tableBg,
  },
  tableTotalRow: {
    flexDirection: 'row',
    borderTop: `1.5pt solid ${colors.black}`,
    borderBottom: `1.5pt solid ${colors.black}`,
    paddingVertical: 6,
  },
  cellNo: {
    width: '8%',
    textAlign: 'center',
    fontSize: 9,
  },
  cellItem: {
    width: '42%',
    fontSize: 9,
    paddingLeft: 4,
  },
  cellQty: {
    width: '10%',
    textAlign: 'center',
    fontSize: 9,
  },
  cellUnit: {
    width: '20%',
    textAlign: 'right',
    fontSize: 9,
    paddingRight: 8,
  },
  cellAmount: {
    width: '20%',
    textAlign: 'right',
    fontSize: 9,
    paddingRight: 4,
  },
  cellBold: {
    fontWeight: 'bold',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 8,
    lineHeight: 1.6,
    color: colors.gray,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: colors.gray,
  },
});

interface EstimateDocumentProps {
  pdfData: EstimatePdfData;
}

export const EstimateDocument: React.FC<EstimateDocumentProps> = ({
  pdfData,
}) => {
  const {
    lineItems,
    subtotal,
    tax,
    totalWithTax,
    contact,
    estimateNumber,
    issueDate,
    validUntil,
    timeline,
    notes,
  } = pdfData;

  const fmt = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

  const hasCompany = !!contact.company;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* タイトル */}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>御 見 積 書</Text>
        </View>

        {/* 上部左右 */}
        <View style={styles.headerRow}>
          {/* 左: 宛名 */}
          <View style={styles.headerLeft}>
            {hasCompany ? (
              <>
                <Text style={styles.clientName}>
                  {contact.company} 御中
                </Text>
                <Text style={styles.clientSub}>
                  {contact.name} 様
                </Text>
              </>
            ) : (
              <Text style={styles.clientName}>
                {contact.name} 様
              </Text>
            )}
          </View>

          {/* 右: 自社情報 */}
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>Antares</Text>
            <Text style={styles.companyDetail}>
              AI開発で、圧倒的なコスト削減を実現。
            </Text>
          </View>
        </View>

        {/* 合計金額ボックス */}
        <View style={styles.totalBox}>
          <Text style={styles.totalBoxLabel}>
            御見積金額
          </Text>
          <View>
            <Text style={styles.totalBoxAmount}>{fmt(totalWithTax)}</Text>
            <Text style={styles.totalBoxTax}>(税込)</Text>
          </View>
        </View>

        {/* メタ情報 */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>見積番号</Text>
            <Text style={styles.metaValue}>{estimateNumber}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>発行日</Text>
            <Text style={styles.metaValue}>{issueDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>有効期限</Text>
            <Text style={styles.metaValue}>{validUntil}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>納期</Text>
            <Text style={styles.metaValue}>{timeline}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>支払条件</Text>
            <Text style={styles.metaValue}>別途ご相談</Text>
          </View>
        </View>

        {/* 明細テーブル */}
        <View style={styles.table}>
          {/* ヘッダー */}
          <View style={styles.tableHeader}>
            <Text style={[styles.cellNo, styles.cellBold]}>No.</Text>
            <Text style={[styles.cellItem, styles.cellBold]}>項目</Text>
            <Text style={[styles.cellQty, styles.cellBold]}>数量</Text>
            <Text style={[styles.cellUnit, styles.cellBold]}>単価</Text>
            <Text style={[styles.cellAmount, styles.cellBold]}>金額</Text>
          </View>

          {/* 明細行 */}
          {lineItems.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cellNo}>{index + 1}</Text>
              <Text style={styles.cellItem}>{row.item}</Text>
              <Text style={styles.cellQty}>{row.quantity}</Text>
              <Text style={styles.cellUnit}>{fmt(row.unitPrice)}</Text>
              <Text style={styles.cellAmount}>{fmt(row.amount)}</Text>
            </View>
          ))}

          {/* 小計 */}
          <View style={styles.tableSummaryRow}>
            <Text style={styles.cellNo} />
            <Text style={[styles.cellItem, styles.cellBold]}>小計</Text>
            <Text style={styles.cellQty} />
            <Text style={styles.cellUnit} />
            <Text style={[styles.cellAmount, styles.cellBold]}>
              {fmt(subtotal)}
            </Text>
          </View>

          {/* 消費税 */}
          <View style={styles.tableSummaryRow}>
            <Text style={styles.cellNo} />
            <Text style={styles.cellItem}>消費税(10%)</Text>
            <Text style={styles.cellQty} />
            <Text style={styles.cellUnit} />
            <Text style={styles.cellAmount}>{fmt(tax)}</Text>
          </View>

          {/* 合計 */}
          <View style={styles.tableTotalRow}>
            <Text style={styles.cellNo} />
            <Text style={[styles.cellItem, styles.cellBold]}>合計金額</Text>
            <Text style={styles.cellQty} />
            <Text style={styles.cellUnit} />
            <Text style={[styles.cellAmount, styles.cellBold]}>
              {fmt(totalWithTax)}
            </Text>
          </View>
        </View>

        {/* 備考 */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>備考</Text>
          <Text style={styles.notesText}>
            * 本見積もりは概算です。詳細なヒアリング後に正式なお見積もりをお出しします。
          </Text>
          {notes && (
            <Text style={styles.notesText}>* {notes}</Text>
          )}
          {contact.message && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.notesText, { fontWeight: 'bold', color: colors.black }]}>
                お問い合わせ内容:
              </Text>
              <Text style={styles.notesText}>{contact.message}</Text>
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
