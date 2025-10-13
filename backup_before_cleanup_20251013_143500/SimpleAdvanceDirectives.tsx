'use client';

import { useState } from 'react';

export default function SimpleAdvanceDirectives() {
  const [name, setName] = useState('');
  const [sections, setSections] = useState<string[]>([]);

  const simpleSections = [
    { id: '1', title: 'מכירת נכס - מותרת', content: 'מיופה הכוח רשאי למכור את הנכס במקרים מסוימים.' },
    { id: '2', title: 'מכירת נכס - אסורה', content: 'אסור למכור את הנכס בשום מקרה.' },
    { id: '3', title: 'ניהול חשבון בנק', content: 'מיופה הכוח מוסמך לנהל את חשבונות הבנק.' },
    { id: '4', title: 'קצבאות ביטוח לאומי', content: 'ניהול קצבאות מביטוח לאומי.' },
    { id: '5', title: 'שמירה על רכב', content: 'שמירה על הרכב כל עוד מסוגל לנהוג.' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center">הנחיות מקדימות - גרסה פשוטה</h1>
      
      <div className="mb-6">
        <label className="block font-bold mb-2">שם הממנה:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="הזן שם מלא"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">בחר סעיפים:</h2>
        <div className="space-y-2">
          {simpleSections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setSections([...sections, sec.content])}
              className="w-full text-right px-4 py-3 border rounded hover:bg-blue-50 transition"
            >
              <div className="font-bold">{sec.title}</div>
              <div className="text-sm text-gray-600">{sec.content}</div>
            </button>
          ))}
        </div>
      </div>

      {sections.length > 0 && (
        <div className="mt-8 p-6 bg-yellow-50 border rounded">
          <h2 className="text-xl font-bold mb-4">סעיפים שנבחרו:</h2>
          {sections.map((s, i) => (
            <div key={i} className="mb-2 p-2 bg-white rounded">{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

