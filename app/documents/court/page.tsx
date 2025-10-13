'use client';

import { useRouter } from 'next/navigation';
import CourtPetition from '@/components/DocumentModules/CourtPetition';

export default function CourtPage() {
  const router = useRouter();

  const handleGenerate = (documentData: any) => {
    const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    savedDocs.push(documentData);
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    alert('כתב בית הדין נוצר בהצלחה! ✅');
    router.push('/my-documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <CourtPetition onGenerate={handleGenerate} />
      </div>
    </div>
  );
}
