'use client';

import { useRouter } from 'next/navigation';
import Appeal from '@/components/DocumentModules/Appeal';

export default function AppealPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Appeal onGenerate={(doc) => {
          const saved = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
          saved.push(doc);
          localStorage.setItem('savedDocuments', JSON.stringify(saved));
          alert('הערעור נוצר! ✅');
          router.push('/my-documents');
        }} />
      </div>
    </div>
  );
}
