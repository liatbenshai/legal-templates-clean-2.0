'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Contract from '@/components/DocumentModules/Contract';

function ContractContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractType = (searchParams.get('type') || 'general') as any;

  const handleGenerate = (documentData: any) => {
    const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    savedDocs.push(documentData);
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    alert('ההסכם נוצר בהצלחה! ✅');
    router.push('/my-documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Contract contractType={contractType} onGenerate={handleGenerate} />
      </div>
    </div>
  );
}

export default function ContractPage() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <ContractContent />
    </Suspense>
  );
}
