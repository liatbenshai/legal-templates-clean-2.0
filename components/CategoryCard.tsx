'use client';

import Link from 'next/link';

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  color?: string;
}

export default function CategoryCard({ 
  icon, 
  title, 
  description, 
  href,
  color = 'blue'
}: CategoryCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  };

  return (
    <Link href={href}>
      <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </div>
    </Link>
  );
}

