import Link from 'next/link';
import { TemplateCategory } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

interface CategoryCardProps {
  category: TemplateCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/templates?category=${category.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 h-full border-2 border-gray-100 hover:border-primary cursor-pointer group relative overflow-hidden">
        {/* אפקט רקע */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          {/* אייקון */}
          <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </div>

          {/* שם הקטגוריה */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>

          {/* תיאור */}
          {category.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          )}

          {/* מספר תבניות */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {category.count} תבניות
            </span>
            <ArrowLeft className="w-5 h-5 text-primary transform group-hover:-translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

