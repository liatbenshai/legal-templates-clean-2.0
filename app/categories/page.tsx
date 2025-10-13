import { categories, updateCategoryCounts } from '@/lib/templates';
import CategoryCard from '@/components/CategoryCard';
import { Folder } from 'lucide-react';

export default function CategoriesPage() {
  const updatedCategories = updateCategoryCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Folder className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">קטגוריות</h1>
          </div>
          <p className="text-xl text-gray-600">
            גלה תבניות משפטיות לפי תחומים
          </p>
        </div>
      </div>

      {/* רשת קטגוריות */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updatedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

