'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Scale, Heart, Handshake, FileCheck, AlertTriangle, FileSignature, ArrowRight } from 'lucide-react';

/**
 * דף בחירת סוג מסמך - נקודת כניסה למודולים
 */

export default function DocumentsPage() {
  const documentTypes = [
    {
      id: 'inheritance-order',
      name: 'צו ירושה',
      icon: Scale,
      description: 'צו ירושה מלא עם יורשים, נכסים וחשבונות בנק',
      color: 'blue',
      href: '/documents/inheritance',
    },
    {
      id: 'will',
      name: 'צוואת יחיד',
      icon: FileText,
      description: 'צוואה אישית עם חלוקת נכסים, מנהל עזבון וחתימות',
      color: 'green',
      href: '/documents/will',
    },
    {
      id: 'mutual-will',
      name: 'צוואה הדדית',
      icon: Heart,
      description: 'צוואה הדדית של בני זוג עם נכסים משותפים',
      color: 'red',
      href: '/documents/mutual-will',
    },
    {
      id: 'court-petition',
      name: 'כתב בית דין',
      icon: Scale,
      description: 'כתב תביעה או הגנה לבית דין - גמיש לפי תפקיד',
      color: 'purple',
      href: '/documents/court',
    },
    {
      id: 'fee-agreement',
      name: 'הסכם שכר טרחה',
      icon: Handshake,
      description: 'הסכם שכר טרחה בין עורך דין ללקוח - מקצועי ומפורט',
      color: 'amber',
      href: '/documents/contract',
    },
    {
      id: 'affidavit',
      name: 'תצהיר',
      icon: FileCheck,
      description: 'תצהיר מלא עם הצהרות וחתימת עורך דין',
      color: 'cyan',
      href: '/documents/affidavit',
    },
    {
      id: 'appeal',
      name: 'ערעור',
      icon: AlertTriangle,
      description: 'ערעור על החלטה עם עילות וסעד מבוקש',
      color: 'orange',
      href: '/documents/appeal',
    },
    {
      id: 'power-of-attorney',
      name: 'ייפוי כוח',
      icon: FileSignature,
      description: 'ייפוי כוח כללי או מיוחד עם הגדרת סמכויות',
      color: 'indigo',
      href: '/documents/power-of-attorney',
    },
    {
      id: 'advance-directives',
      name: 'הנחיות מקדימות 📋',
      icon: FileText,
      description: 'ייפוי כוח מתמשך - מסמך מקיף לניהול רכוש, בריאות וחיים עם מחסן סעיפים',
      color: 'teal',
      href: '/documents/advance-directives',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">יצירת מסמכים משפטיים</h1>
            <p className="text-xl text-blue-100 mb-8">
              בחר את סוג המסמך שברצונך ליצור - המערכת תדריך אותך צעד אחר צעד
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>גמישות מקסימלית</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>טבלאות דינמיות</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>ייצוא Word & PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* רשת מסמכים */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes.map((doc) => {
              const Icon = doc.icon;
              return (
                <Link
                  key={doc.id}
                  href={doc.href}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary"
                >
                  <div className={`bg-gradient-to-br from-${doc.color}-50 to-${doc.color}-100 p-6 border-b-2 border-${doc.color}-200`}>
                    <Icon className={`w-12 h-12 text-${doc.color}-600 mb-3`} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {doc.name}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {doc.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                      <span>התחל ←</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* מידע נוסף */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ למה לבחור במערכת שלנו?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-primary mb-2">🎯 גמישות מקסימלית</h3>
              <p className="text-gray-600">כל מסמך מותאם לצרכים שלך - הוסף יורשים, נכסים, צדדים ללא הגבלה</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">🔤 תמיכה בזכר/נקבה</h3>
              <p className="text-gray-600">המערכת מטפלת אוטומטית בנטיות עבריות נכונות</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">✍️ חתימות מקצועיות</h3>
              <p className="text-gray-600">הוסף חתימות טקסט או תמונות - גמיש לחלוטין</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">📥 ייצוא מתקדם</h3>
              <p className="text-gray-600">ייצוא ל-Word או PDF עם סימן מים, מספור עמודים והעתקים</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">🤖 AI משפטי</h3>
              <p className="text-gray-600">שיפור אוטומטי של הטקסט לעברית משפטית תקינה</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">📊 טבלאות חכמות</h3>
              <p className="text-gray-600">טבלאות שמשתנות לפי הצורך - מושלם לכתבי בית דין</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
