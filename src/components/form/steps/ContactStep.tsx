interface ContactInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactStepProps {
  value: ContactInfo;
  onChange: (value: ContactInfo) => void;
  errors?: Record<string, string>;
}

export default function ContactStep({ value, onChange, errors }: ContactStepProps) {
  const handleChange = (field: keyof ContactInfo, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">お客様情報を入力</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            value={value.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors?.name ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors?.name}
            aria-describedby={errors?.name ? 'contact-name-error' : undefined}
          />
          {errors?.name && (
            <p id="contact-name-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-1">
            会社名
          </label>
          <input
            type="text"
            id="contact-company"
            value={value.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            value={value.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors?.email ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors?.email}
            aria-describedby={errors?.email ? 'contact-email-error' : undefined}
          />
          {errors?.email && (
            <p id="contact-email-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
            電話番号
          </label>
          <input
            type="tel"
            id="contact-phone"
            value={value.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
            ご要望・メッセージ
          </label>
          <textarea
            id="contact-message"
            value={value.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
