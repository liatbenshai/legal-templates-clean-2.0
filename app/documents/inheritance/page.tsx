'use client';

import { useRouter } from 'next/navigation';
import InheritanceOrder from '@/components/DocumentModules/InheritanceOrder';

export default function InheritancePage() {
  const router = useRouter();

  const handleGenerate = (documentData: any) => {
    const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    savedDocs.push(documentData);
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    alert('צו הירושה נוצר בהצלחה! ✅');
    router.push('/my-documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <InheritanceOrder onGenerate={handleGenerate} />
      </div>
    </div>
  );
}
