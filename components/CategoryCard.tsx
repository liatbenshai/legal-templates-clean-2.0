'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  const colorAccents = {
    blue: {
      gradient: 'from-blue-500/20 to-blue-600/10',
      hoverGradient: 'hover:from-blue-500/30 hover:to-blue-600/20',
      border: 'border-blue-200/50 hover:border-blue-300/70',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
    },
    green: {
      gradient: 'from-green-500/20 to-green-600/10',
      hoverGradient: 'hover:from-green-500/30 hover:to-green-600/20',
      border: 'border-green-200/50 hover:border-green-300/70',
      text: 'text-green-700',
      iconBg: 'bg-green-100',
    },
    purple: {
      gradient: 'from-purple-500/20 to-purple-600/10',
      hoverGradient: 'hover:from-purple-500/30 hover:to-purple-600/20',
      border: 'border-purple-200/50 hover:border-purple-300/70',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100',
    },
    orange: {
      gradient: 'from-orange-500/20 to-orange-600/10',
      hoverGradient: 'hover:from-orange-500/30 hover:to-orange-600/20',
      border: 'border-orange-200/50 hover:border-orange-300/70',
      text: 'text-orange-700',
      iconBg: 'bg-orange-100',
    },
    red: {
      gradient: 'from-red-500/20 to-red-600/10',
      hoverGradient: 'hover:from-red-500/30 hover:to-red-600/20',
      border: 'border-red-200/50 hover:border-red-300/70',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
    },
    teal: {
      gradient: 'from-teal-500/20 to-teal-600/10',
      hoverGradient: 'hover:from-teal-500/30 hover:to-teal-600/20',
      border: 'border-teal-200/50 hover:border-teal-300/70',
      text: 'text-teal-700',
      iconBg: 'bg-teal-100',
    },
  };

  const colorStyle = colorAccents[color as keyof typeof colorAccents] || colorAccents.blue;

  return (
    <Link href={href}>
      <div className={cn(
        // Base glass effect
        "glass rounded-xl p-6 transition-all duration-300 cursor-pointer group",
        // Gradient overlay
        "bg-gradient-to-br",
        colorStyle.gradient,
        colorStyle.hoverGradient,
        // Border
        "border",
        colorStyle.border,
        // Hover effects
        "hover:shadow-glass-lg hover:-translate-y-2"
      )}>
        {/* Icon with glass background */}
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
          "glass group-hover:scale-110 transition-transform duration-300",
          colorStyle.iconBg
        )}>
          <span className="text-3xl">{icon}</span>
        </div>

        {/* Title */}
        <h3 className={cn(
          "text-xl font-bold mb-2",
          colorStyle.text
        )}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Hover indicator */}
        <div className={cn(
          "mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colorStyle.text
        )}>
          <span>צפה בתבניות</span>
          <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
