import { SYSTEM_TYPES, SCALES, FEATURES, TIMELINES } from '../../../lib/constants';
import { calculateEstimate, formatCurrency } from '../../../lib/estimate-calculator';
import type { EstimateFormData } from '../../../lib/form-schema';

interface ConfirmStepProps {
  data: EstimateFormData;
}

export default function ConfirmStep({ data }: ConfirmStepProps) {
  const systemType = SYSTEM_TYPES.find((s) => s.id === data.systemType);
  const scale = SCALES.find((s) => s.id === data.scale);
  const timeline = TIMELINES.find((t) => t.id === data.timeline);
  const selectedFeatures = data.features
    .map((id) => FEATURES.find((f) => f.id === id))
    .filter(Boolean);

  const estimate = calculateEstimate(data);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">入力内容の確認</h2>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">システム種類</div>
          <div className="font-medium">
            {systemType?.icon} {systemType?.label}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">プロジェクト規模</div>
          <div className="font-medium">{scale?.label}</div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">選択機能</div>
          <div className="font-medium">
            {selectedFeatures.length > 0
              ? selectedFeatures.map((f) => f?.label).join('、')
              : 'なし'}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">希望納期</div>
          <div className="font-medium">{timeline?.label}</div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="text-sm text-gray-600 mb-1">お名前</div>
          <div className="font-medium">{data.contact.name}</div>
        </div>

        {data.contact.company && (
          <div>
            <div className="text-sm text-gray-600 mb-1">会社名</div>
            <div className="font-medium">{data.contact.company}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-600 mb-1">メールアドレス</div>
          <div className="font-medium">{data.contact.email}</div>
        </div>

        {data.contact.phone && (
          <div>
            <div className="text-sm text-gray-600 mb-1">電話番号</div>
            <div className="font-medium">{data.contact.phone}</div>
          </div>
        )}

        {data.contact.message && (
          <div>
            <div className="text-sm text-gray-600 mb-1">ご要望・メッセージ</div>
            <div className="font-medium whitespace-pre-wrap">{data.contact.message}</div>
          </div>
        )}
      </div>

      <div className="bg-primary-50 border-2 border-primary-500 rounded-xl p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">概算見積もり</div>
        <div className="text-2xl font-bold text-primary-600">
          {formatCurrency(estimate.min)} 〜 {formatCurrency(estimate.max)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          ※ あくまで概算です。詳細はお見積もりをご確認ください。
        </div>
      </div>
    </div>
  );
}
