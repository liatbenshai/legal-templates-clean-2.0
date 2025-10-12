'use client';

import ProfessionalWillForm from '@/components/ProfessionalWillForm';

export default function MutualWillPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProfessionalWillForm defaultWillType="mutual" />
    </div>
  );
}
