'use client';

import { useState } from 'react';
import { FileText, Handshake } from 'lucide-react';
import SignatureList from '../SignatureList';
import { SignatureData } from '../SignatureBlock';
import GenderSelector from '../GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';

/**
 * מודול הסכם כללי
 * תומך בכל סוגי הסכמים: שכירות, מכר, עבודה, שותפות
 */

interface ContractProps {
  contractType: 'rent' | 'sale' | 'employment' | 'partnership' | 'general';
  onGenerate: (document: any) => void;
}

export default function Contract({ contractType = 'general', onGenerate }: ContractProps) {
  const [party1, setParty1] = useState({
    name: '',
    idNumber: '',
    address: '',
    phone: '',
    email: '',
    gender: 'male' as Gender,
    role: getDefaultRole1(contractType),
  });

  const [party2, setParty2] = useState({
    name: '',
    idNumber: '',
    address: '',
    phone: '',
    email: '',
    gender: 'female' as Gender,
    role: getDefaultRole2(contractType),
  });

  const [contractDetails, setContractDetails] = useState({
    subject: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    amount: '',
    paymentTerms: '',
    specialConditions: '',
  });

  const [signatures, setSignatures] = useState<SignatureData[]>([
    {
      id: 'party1',
      signerName: '',
      signerRole: getDefaultRole1(contractType),
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
    {
      id: 'party2',
      signerName: '',
      signerRole: getDefaultRole2(contractType),
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
  ]);

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      {/* כותרת */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Handshake className="w-8 h-8 text-primary" />
          {getContractTitle(contractType)}
        </h1>
        <p className="text-gray-600">
          {getContractDescription(contractType)}
        </p>
      </div>

      {/* צד ראשון */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {party1.role || 'צד ראשון'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={party1.name}
              onChange={(e) => setParty1({ ...party1, name: e.target.value })}
              placeholder="שם פרטי ומשפחה / שם חברה"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תעודת זהות / ח.פ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={party1.idNumber}
              onChange={(e) => setParty1({ ...party1, idNumber: e.target.value })}
              placeholder="123456789 או 51-1234567-8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת
            </label>
            <input
              type="text"
              value={party1.address}
              onChange={(e) => setParty1({ ...party1, address: e.target.value })}
              placeholder="רחוב, מספר, עיר, מיקוד"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>

        <GenderSelector
          value={party1.gender}
          onChange={(gender) => setParty1({ ...party1, gender })}
          label="סוג"
          showOrganization={true}
          size="small"
        />
      </section>

      {/* צד שני */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {party2.role || 'צד שני'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={party2.name}
              onChange={(e) => setParty2({ ...party2, name: e.target.value })}
              placeholder="שם פרטי ומשפחה / שם חברה"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תעודת זהות / ח.פ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={party2.idNumber}
              onChange={(e) => setParty2({ ...party2, idNumber: e.target.value })}
              placeholder="123456789 או 51-1234567-8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת
            </label>
            <input
              type="text"
              value={party2.address}
              onChange={(e) => setParty2({ ...party2, address: e.target.value })}
              placeholder="רחוב, מספר, עיר, מיקוד"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>

        <GenderSelector
          value={party2.gender}
          onChange={(gender) => setParty2({ ...party2, gender })}
          label="סוג"
          showOrganization={true}
          size="small"
        />
      </section>

      {/* פרטי ההסכם */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">פרטי ההסכם</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נושא ההסכם <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contractDetails.subject}
              onChange={(e) => setContractDetails({ ...contractDetails, subject: e.target.value })}
              placeholder={getSubjectPlaceholder(contractType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תאריך תחילה
              </label>
              <input
                type="date"
                value={contractDetails.startDate}
                onChange={(e) => setContractDetails({ ...contractDetails, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תאריך סיום (אם רלוונטי)
              </label>
              <input
                type="date"
                value={contractDetails.endDate}
                onChange={(e) => setContractDetails({ ...contractDetails, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סכום/תמורה
              </label>
              <input
                type="text"
                value={contractDetails.amount}
                onChange={(e) => setContractDetails({ ...contractDetails, amount: e.target.value })}
                placeholder="סכום בש״ח"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תנאי תשלום
              </label>
              <input
                type="text"
                value={contractDetails.paymentTerms}
                onChange={(e) => setContractDetails({ ...contractDetails, paymentTerms: e.target.value })}
                placeholder="חודשי/שנתי/חד פעמי"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תנאים מיוחדים
            </label>
            <textarea
              value={contractDetails.specialConditions}
              onChange={(e) => setContractDetails({ ...contractDetails, specialConditions: e.target.value })}
              placeholder="תנאים נוספים, סייגים, התניות..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
            />
          </div>
        </div>
      </section>

      {/* חתימות */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <SignatureList
          signatures={signatures}
          onChange={setSignatures}
          minSignatures={2}
          maxSignatures={4}
          title="חתימות הצדדים"
        />
      </section>

      {/* כפתור יצירה */}
      <div className="flex justify-center pt-6 border-t">
        <button
          onClick={() => onGenerate({
            type: `contract-${contractType}`,
            title: `${getContractTitle(contractType)} - ${party1.name} ו-${party2.name}`,
            party1,
            party2,
            contractDetails,
            signatures,
            generatedAt: new Date().toISOString(),
          })}
          disabled={
            !party1.name || !party1.idNumber ||
            !party2.name || !party2.idNumber ||
            !contractDetails.subject
          }
          className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-primary transition disabled:opacity-50 font-bold text-lg shadow-xl"
        >
          <FileText className="w-6 h-6" />
          <span>צור הסכם מלא</span>
        </button>
      </div>
    </div>
  );
}

// פונקציות עזר
function getDefaultRole1(type: string): string {
  switch (type) {
    case 'rent': return 'משכיר';
    case 'sale': return 'מוכר';
    case 'employment': return 'מעביד';
    case 'partnership': return 'שותף א';
    default: return 'צד א';
  }
}

function getDefaultRole2(type: string): string {
  switch (type) {
    case 'rent': return 'שוכר';
    case 'sale': return 'קונה';
    case 'employment': return 'עובד';
    case 'partnership': return 'שותף ב';
    default: return 'צד ב';
  }
}

function getContractTitle(type: string): string {
  switch (type) {
    case 'rent': return 'הסכם שכירות';
    case 'sale': return 'הסכם מכר';
    case 'employment': return 'הסכם עבודה';
    case 'partnership': return 'הסכם שותפות';
    default: return 'הסכם';
  }
}

function getContractDescription(type: string): string {
  switch (type) {
    case 'rent': return 'הסכם שכירות דירה או נכס';
    case 'sale': return 'הסכם מכר נכס או נכסים';
    case 'employment': return 'הסכם העסקה בין מעביד לעובד';
    case 'partnership': return 'הסכם שותפות עסקית';
    default: return 'הסכם כללי בין שני צדדים';
  }
}

function getSubjectPlaceholder(type: string): string {
  switch (type) {
    case 'rent': return 'דירה ברחוב... עיר...';
    case 'sale': return 'נכס ברחוב... עיר...';
    case 'employment': return 'עבודה בתפקיד...';
    case 'partnership': return 'שותפות ב...';
    default: return 'נושא ההסכם';
  }
}
