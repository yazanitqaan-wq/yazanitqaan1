import React, { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface GetInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsFound: (secretCode: string, password: string) => void;
}

export default function GetInfoModal({ isOpen, onClose, onCredentialsFound }: GetInfoModalProps) {
  const [formData, setFormData] = useState({
    nationalId: '',
    birthDate: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ secret_code: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { credentials: data, error: fetchError } = await authService.getMyInfo(
      formData.nationalId,
      formData.birthDate,
      formData.firstName,
      formData.lastName
    );

    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setCredentials(data);
    }
    
    setLoading(false);
  };

  const handleCopyAndLogin = () => {
    if (credentials) {
      navigator.clipboard.writeText(`Code: ${credentials.secret_code}, Pass: ${credentials.password}`);
      setCopied(true);
      setTimeout(() => {
        onCredentialsFound(credentials.secret_code, credentials.password);
        onClose();
        // Reset state for next time
        setCredentials(null);
        setFormData({ nationalId: '', birthDate: '', firstName: '', lastName: '' });
        setCopied(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">استرجاع بيانات الدخول</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!credentials ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرقم الوطني</label>
                <input
                  type="text"
                  name="nationalId"
                  required
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="كما هو في الهوية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأخير</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {loading ? 'جاري البحث...' : 'بحث عن بياناتي'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-green-800 mb-1">تم العثور على بياناتك</h3>
                <p className="text-sm text-green-600">يرجى الاحتفاظ بهذه البيانات للدخول لاحقاً</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">الكود السري</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg text-center font-bold text-gray-800">
                    {credentials.secret_code}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">كلمة المرور</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg text-center font-bold text-gray-800">
                    {credentials.password}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyAndLogin}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    تم النسخ! جاري تحويلك...
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    نسخ وتسجيل الدخول
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
