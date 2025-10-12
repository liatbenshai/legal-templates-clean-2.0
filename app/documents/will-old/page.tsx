'use client';

import { useRouter } from 'next/navigation';
import Will from '@/components/DocumentModules/Will';

export default function OldWillPage() {
  const router = useRouter();

  const handleGenerate = (documentData: any) => {
    // שמירה ל-localStorage
    const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    savedDocs.push(documentData);
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    
    alert('הצוואה נוצרה בהצלחה! ✅');
    router.push('/my-documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">צוואה - גרסה ישנה</h1>
        <Will onGenerate={handleGenerate} />
      </div>
    </div>
  );
}
