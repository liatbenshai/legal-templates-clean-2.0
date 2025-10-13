'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import SignatureBlock, { SignatureData } from './SignatureBlock';

/**
 * רשימת חתימות - ניהול מספר חתימות במסמך
 */

interface SignatureListProps {
  signatures: SignatureData[];
  onChange: (signatures: SignatureData[]) => void;
  minSignatures?: number;
  maxSignatures?: number;
  title?: string;
}

export default function SignatureList({
  signatures,
  onChange,
  minSignatures = 1,
  maxSignatures = 10,
  title = 'חתימות'
}: SignatureListProps) {
  const addSignature = () => {
    if (signatures.length < maxSignatures) {
      const newSignature: SignatureData = {
        id: `sig-${Date.now()}`,
        signerName: '',
        signerRole: 'צד',
        date: new Date().toISOString().split('T')[0],
        signatureType: 'text',
      };
      onChange([...signatures, newSignature]);
    }
  };

  const updateSignature = (index: number, updated: SignatureData) => {
    const newSignatures = [...signatures];
    newSignatures[index] = updated;
    onChange(newSignatures);
  };

  const removeSignature = (index: number) => {
    if (signatures.length > minSignatures) {
      onChange(signatures.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          ✍️ {title}
          <span className="text-sm font-normal text-gray-500">
            ({signatures.length})
          </span>
        </h3>
        <button
          onClick={addSignature}
          disabled={signatures.length >= maxSignatures}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף חתימה</span>
        </button>
      </div>

      {/* רשימת חתימות */}
      <div className="space-y-4">
        {signatures.map((sig, index) => (
          <SignatureBlock
            key={sig.id}
            signature={sig}
            onChange={(updated) => updateSignature(index, updated)}
            onRemove={() => removeSignature(index)}
            showRemove={signatures.length > minSignatures}
          />
        ))}
      </div>

      {/* הודעות */}
      <div className="text-sm text-gray-600">
        {signatures.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="mb-3">לא הוספת חתימות עדיין</p>
            <button
              onClick={addSignature}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
            >
              הוסף חתימה ראשונה
            </button>
          </div>
        )}
        {signatures.length < maxSignatures && signatures.length > 0 && (
          <p className="text-gray-500">
            ניתן להוסיף עוד {maxSignatures - signatures.length} חתימות
          </p>
        )}
        {signatures.length >= maxSignatures && (
          <p className="text-amber-600">
            הגעת למקסימום חתימות ({maxSignatures})
          </p>
        )}
      </div>

      {/* הסבר */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">💡 טיפ:</p>
        <ul className="space-y-1 mr-4">
          <li>• ניתן להוסיף חתימה כטקסט (קו חתימה) או כתמונה</li>
          <li>• החתימות יופיעו בסוף המסמך בסדר שהוספת</li>
          <li>• בייצוא ל-PDF/Word, החתימות ישמרו במיקום המדויק</li>
        </ul>
      </div>
    </div>
  );
}
