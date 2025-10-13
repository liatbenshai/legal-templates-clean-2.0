'use client';

import { useRouter } from 'next/navigation';
import Affidavit from '@/components/DocumentModules/Affidavit';

export default function AffidavitPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Affidavit onGenerate={(doc) => {
          const saved = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
          saved.push(doc);
          localStorage.setItem('savedDocuments', JSON.stringify(saved));
          alert('התצהיר נוצר! ✅');
          router.push('/my-documents');
        }} />
      </div>
    </div>
  );
}
