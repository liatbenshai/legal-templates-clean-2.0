'use client';

import { useRouter } from 'next/navigation';
import PowerOfAttorney from '@/components/DocumentModules/PowerOfAttorney';

export default function PowerOfAttorneyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PowerOfAttorney onGenerate={(doc) => {
          const saved = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
          saved.push(doc);
          localStorage.setItem('savedDocuments', JSON.stringify(saved));
          alert('ייפוי הכוח נוצר! ✅');
          router.push('/my-documents');
        }} />
      </div>
    </div>
  );
}
