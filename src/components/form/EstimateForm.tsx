import { useState, useEffect, useRef } from 'react';
import { stepSchemas, type EstimateFormData } from '../../lib/form-schema';
import FormProgress from './FormProgress';
import SystemTypeStep from './steps/SystemTypeStep';
import ScaleStep from './steps/ScaleStep';
import FeaturesStep from './steps/FeaturesStep';
import TimelineStep from './steps/TimelineStep';
import ContactStep from './steps/ContactStep';
import ConfirmStep from './steps/ConfirmStep';

type SubmitStatus = 'idle' | 'success' | 'error';

export default function EstimateForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const [formData, setFormData] = useState<Partial<EstimateFormData>>({
    systemType: '',
    scale: '',
    features: [],
    timeline: '',
    contact: {
      name: '',
      company: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // モーダル表示時にbodyのスクロールを無効化
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && currentStep > 0) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, currentStep]);

  // フォーカストラップ
  useEffect(() => {
    if (!isModalOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isModalOpen, currentStep]);

  // Step 0でシステム種類を選択したらモーダルを開く
  const handleSystemTypeChange = (value: string) => {
    setFormData({ ...formData, systemType: value });
    setErrors({});
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  const validateStep = (step: number): boolean => {
    setErrors({});

    if (step === 0) {
      const result = stepSchemas[0].safeParse({ systemType: formData.systemType });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } else if (step === 1) {
      const result = stepSchemas[1].safeParse({ scale: formData.scale });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } else if (step === 2) {
      const result = stepSchemas[2].safeParse({ features: formData.features });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } else if (step === 3) {
      const result = stepSchemas[3].safeParse({ timeline: formData.timeline });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } else if (step === 4) {
      const result = stepSchemas[4].safeParse({ contact: formData.contact });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    } else if (currentStep === 1) {
      setIsModalOpen(false);
      setCurrentStep(0);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      setSubmitStatus('success');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSubmitStatus('idle');
  };

  const handleReset = () => {
    setFormData({
      systemType: '',
      scale: '',
      features: [],
      timeline: '',
      contact: {
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
      },
    });
    setCurrentStep(0);
    setIsModalOpen(false);
    setSubmitStatus('idle');
    setErrors({});
  };

  const getContactErrors = () => {
    const contactErrors: Record<string, string> = {};
    Object.keys(errors).forEach((key) => {
      if (key.startsWith('contact.')) {
        const field = key.replace('contact.', '');
        contactErrors[field] = errors[key];
      }
    });
    return contactErrors;
  };

  return (
    <>
      {/* Step 0: Hero内のインライン表示 */}
      {currentStep === 0 && !isModalOpen && (
        <div className="max-w-4xl mx-auto">
          <SystemTypeStep
            value={formData.systemType || ''}
            onChange={handleSystemTypeChange}
            error={errors.systemType}
          />
        </div>
      )}

      {/* Step 1-5: モーダル表示 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && currentStep > 0) {
              handleBack();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="見積もりフォーム"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FormProgress currentStep={currentStep - 1} totalSteps={5} />

            <div
              className="transition-all duration-300"
              style={{
                transform: `translateX(0)`,
              }}
            >
              {currentStep === 1 && (
                <ScaleStep
                  value={formData.scale || ''}
                  onChange={(value) => setFormData({ ...formData, scale: value })}
                  error={errors.scale}
                />
              )}

              {currentStep === 2 && (
                <FeaturesStep
                  value={formData.features || []}
                  onChange={(value) => setFormData({ ...formData, features: value })}
                  error={errors.features}
                />
              )}

              {currentStep === 3 && (
                <TimelineStep
                  value={formData.timeline || ''}
                  onChange={(value) => setFormData({ ...formData, timeline: value })}
                  error={errors.timeline}
                />
              )}

              {currentStep === 4 && (
                <ContactStep
                  value={formData.contact!}
                  onChange={(value) => setFormData({ ...formData, contact: value })}
                  errors={getContactErrors()}
                />
              )}

              {currentStep === 5 && submitStatus === 'idle' && (
                <ConfirmStep data={formData as EstimateFormData} />
              )}

              {currentStep === 5 && submitStatus === 'success' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold mb-4">送信完了</h2>
                  <p className="text-gray-600 mb-6">
                    見積もりをメールにお送りしました！
                    <br />
                    担当者より改めてご連絡いたします。
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              )}

              {currentStep === 5 && submitStatus === 'error' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-2xl font-bold mb-4">送信エラー</h2>
                  <p className="text-gray-600 mb-6">
                    申し訳ございません。送信に失敗しました。
                    <br />
                    もう一度お試しください。
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    再送信
                  </button>
                </div>
              )}
            </div>

            {/* ナビゲーションボタン */}
            {submitStatus === 'idle' && (
              <div className="flex gap-3 mt-8">
                <button
                  ref={firstFocusableRef}
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  戻る
                </button>

                {currentStep < 5 && (
                  <button
                    ref={lastFocusableRef}
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    次へ
                  </button>
                )}

                {currentStep === 5 && (
                  <button
                    ref={lastFocusableRef}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {isSubmitting ? '送信中...' : '送信する'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
