'use client';

import { useState } from 'react';
import { PenTool, Upload, X } from 'lucide-react';

/**
 * בלוק חתימה יחיד
 * תומך בחתימה טקסטואלית או תמונה
 */

export interface SignatureData {
  id: string;
  signerName: string;
  signerRole: string;
  date: string;
  signatureType: 'text' | 'image';
  signatureImage?: string;
}

interface SignatureBlockProps {
  signature?: SignatureData;
  onChange: (signature: SignatureData) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function SignatureBlock({
  signature,
  onChange,
  onRemove,
  showRemove = false
}: SignatureBlockProps) {
  const [data, setData] = useState<SignatureData>(signature || {
    id: `sig-${Date.now()}`,
    signerName: '',
    signerRole: 'צד',
    date: new Date().toISOString().split('T')[0],
    signatureType: 'text',
  });

  const handleChange = (updates: Partial<SignatureData>) => {
    const updated = { ...data, ...updates };
    setData(updated);
    onChange(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange({
          signatureType: 'image',
          signatureImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const commonRoles = [
    'צד',
    'תובע',
    'נתבע',
    'עד',
    'מצווה',
    'יורש',
    'בא כוח',
    'עורך דין',
    'רו"ח',
    'מנהל עזבון',
    'אפוטרופוס',
  ];

  return (
    <div className="relative border-2 border-gray-300 rounded-lg p-6 bg-white hover:border-blue-400 transition">
      {/* כפתור הסרה */}
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 left-2 p-1 text-red-600 hover:bg-red-50 rounded-full transition"
          title="הסר חתימה"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-4">
        <PenTool className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-gray-900">חתימה</h3>
      </div>

      <div className="space-y-4">
        {/* שם החותם */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם החותם <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.signerName}
            onChange={(e) => handleChange({ signerName: e.target.value })}
            placeholder="שם מלא"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </div>

        {/* תפקיד */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תפקיד
          </label>
          <select
            value={data.signerRole}
            onChange={(e) => handleChange({ signerRole: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          >
            {commonRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* תאריך */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תאריך חתימה
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => handleChange({ date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </div>

        {/* סוג חתימה */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג חתימה
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange({ signatureType: 'text', signatureImage: undefined })}
              className={`p-3 rounded-lg border-2 transition ${
                data.signatureType === 'text'
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <PenTool className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">קו חתימה</div>
            </button>

            <button
              type="button"
              onClick={() => handleChange({ signatureType: 'image' })}
              className={`p-3 rounded-lg border-2 transition ${
                data.signatureType === 'image'
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">תמונת חתימה</div>
            </button>
          </div>
        </div>

        {/* העלאת תמונה */}
        {data.signatureType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              העלה תמונת חתימה
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            {data.signatureImage && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <img
                  src={data.signatureImage}
                  alt="חתימה"
                  className="max-h-20 mx-auto"
                />
              </div>
            )}
          </div>
        )}

        {/* תצוגה מקדימה */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-2">תצוגה מקדימה:</div>
          <div dir="rtl" style={{ fontFamily: 'David', fontSize: '13pt' }}>
            {data.signatureType === 'text' ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{data.signerRole || 'צד'}:</div>
                  <div className="border-b-2 border-gray-800 pb-1 w-48">
                    {data.signerName || '[שם החותם]'}
                  </div>
                </div>
                {data.date && (
                  <div className="text-sm text-gray-600">
                    תאריך: {new Date(data.date).toLocaleDateString('he-IL')}
                  </div>
                )}
              </div>
            ) : data.signatureImage ? (
              <div className="space-y-2">
                <img
                  src={data.signatureImage}
                  alt="חתימה"
                  className="max-h-16"
                />
                <div className="text-sm">
                  <div><strong>{data.signerName || '[שם החותם]'}</strong></div>
                  <div className="text-gray-600">{data.signerRole}</div>
                  {data.date && (
                    <div className="text-gray-600">
                      {new Date(data.date).toLocaleDateString('he-IL')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">העלה תמונת חתימה...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
