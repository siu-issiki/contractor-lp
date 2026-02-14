import { useState } from 'react';
import type { ContactInfo } from '../../lib/ai/types';
import { contactSchema } from '../../lib/ai/schemas';

interface ContactFormProps {
  onSubmit: (contact: ContactInfo) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ContactForm({
  onSubmit,
  onBack,
  isSubmitting,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactInfo>({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof ContactInfo,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of result.error.errors) {
        const field = err.path[0];
        if (typeof field === 'string') {
          fieldErrors[field] = err.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">連絡先を入力</h3>
        <p className="text-sm text-gray-600">
          見積書をメールでお送りします。
        </p>
      </div>

      {/* お名前 */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="山田 太郎"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* 会社名 */}
      <div>
        <label
          htmlFor="contact-company"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          会社名
        </label>
        <input
          id="contact-company"
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="株式会社サンプル"
        />
      </div>

      {/* メールアドレス */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="yamada@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* 電話番号 */}
      <div>
        <label
          htmlFor="contact-phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          電話番号
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="03-1234-5678"
        />
      </div>

      {/* メッセージ */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          メッセージ
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="ご質問やご要望があれば..."
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          戻る
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '見積もりを送信'}
        </button>
      </div>
    </form>
  );
}
