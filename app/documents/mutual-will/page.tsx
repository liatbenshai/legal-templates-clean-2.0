'use client';

import { useRouter } from 'next/navigation';
import MutualWill from '@/components/DocumentModules/MutualWill';

export default function MutualWillPage() {
  const router = useRouter();

  const handleGenerate = (documentData: any) => {
    const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    savedDocs.push(documentData);
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    alert('הצוואה ההדדית נוצרה בהצלחה! ✅');
    router.push('/my-documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <MutualWill onGenerate={handleGenerate} />
      </div>
    </div>
  );
}
