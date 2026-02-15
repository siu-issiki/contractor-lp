import type { AIEstimateData } from '../../lib/ai/types';

interface EstimatePreviewProps {
  estimate: AIEstimateData;
  onBack: () => void;
  onAccept: () => void;
}

export default function EstimatePreview({
  estimate,
  onBack,
  onAccept,
}: EstimatePreviewProps) {
  const subtotal = estimate.lineItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const tax = Math.round(subtotal * 0.1);
  const totalWithTax = subtotal + tax;

  const fmt = (n: number) => `\u00A5${n.toLocaleString('ja-JP')}`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          見積もりプレビュー
        </h3>
        <p className="text-sm text-gray-600">{estimate.projectSummary}</p>
      </div>

      {/* 明細テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 pr-4">項目</th>
              <th className="text-center py-2 px-2 w-16">数量</th>
              <th className="text-right py-2 px-2 w-24">単価</th>
              <th className="text-right py-2 pl-2 w-24">金額</th>
            </tr>
          </thead>
          <tbody>
            {estimate.lineItems.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2 pr-4">{item.item}</td>
                <td className="text-center py-2 px-2">{item.quantity}</td>
                <td className="text-right py-2 px-2">{fmt(item.unitPrice)}</td>
                <td className="text-right py-2 pl-2">{fmt(item.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-b border-gray-200">
              <td colSpan={3} className="text-right py-2 pr-2 font-medium">
                小計
              </td>
              <td className="text-right py-2 pl-2 font-medium">
                {fmt(subtotal)}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td colSpan={3} className="text-right py-2 pr-2 text-gray-600">
                消費税(10%)
              </td>
              <td className="text-right py-2 pl-2 text-gray-600">
                {fmt(tax)}
              </td>
            </tr>
            <tr className="border-t-2 border-gray-800">
              <td colSpan={3} className="text-right py-2 pr-2 font-bold">
                合計(税込)
              </td>
              <td className="text-right py-2 pl-2 font-bold text-lg">
                {fmt(totalWithTax)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 納期 */}
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">想定納期:</span>{' '}
        {estimate.timeline}
      </div>

      {/* 備考 */}
      {estimate.notes && (
        <div className="text-sm text-gray-600 whitespace-pre-line">
          <span className="font-medium text-gray-800">備考:</span>{' '}
          {estimate.notes}
        </div>
      )}

      <p className="text-xs text-gray-500">
        ※ 本見積もりは概算です。詳細なヒアリング後に正式なお見積もりをお出しします。
      </p>

      {/* ボタン */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          チャットに戻る
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          この内容で見積もりを受け取る
        </button>
      </div>
    </div>
  );
}
