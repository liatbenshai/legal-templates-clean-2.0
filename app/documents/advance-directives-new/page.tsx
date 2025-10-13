'use client';

import { useState } from 'react';
import { FileText, User, Download, Plus } from 'lucide-react';

export default function AdvanceDirectivesPage() {
  const [formData, setFormData] = useState({
    principalName: '',
    principalId: '',
    principalAddress: '',
    attorneyName: '',
    attorneyId: '',
    attorneyAddress: '',
    sections: [] as string[]
  });

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, '']
    });
  };

  const updateSection = (index: number, value: string) => {
    const newSections = [...formData.sections];
    newSections[index] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index: number) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  const generateDocument = () => {
    const doc = `הנחיות מקדימות בייפוי כוח מתמשך

פרטי הממנה:
שם: ${formData.principalName}
ת.ז: ${formData.principalId}
כתובת: ${formData.principalAddress}

פרטי מיופה הכוח:
שם: ${formData.attorneyName}
ת.ז: ${formData.attorneyId}
כתובת: ${formData.attorneyAddress}

סעיפים:
${formData.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

תאריך: ${new Date().toLocaleDateString('he-IL')}`;

    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `הנחיות-מקדימות-${formData.principalName || 'מסמך'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-blue-600" />
            הנחיות מקדימות בייפוי כוח מתמשך
          </h1>
          <p className="text-gray-600">מלא את הפרטים ליצירת מסמך הנחיות מקדימות מקצועי</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 space-y-8">
          <section className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6" />
              פרטי הממנה
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="הזן שם מלא"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
                <input
                  type="text"
                  value={formData.principalId}
                  onChange={(e) => setFormData({ ...formData, principalId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="9 ספרות"
                  maxLength={9}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
                <input
                  type="text"
                  value={formData.principalAddress}
                  onChange={(e) => setFormData({ ...formData, principalAddress: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="רחוב, עיר, מיקוד"
                />
              </div>
            </div>
          </section>

          <section className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6" />
              פרטי מיופה הכוח
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={formData.attorneyName}
                  onChange={(e) => setFormData({ ...formData, attorneyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="הזן שם מלא"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
                <input
                  type="text"
                  value={formData.attorneyId}
                  onChange={(e) => setFormData({ ...formData, attorneyId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="9 ספרות"
                  maxLength={9}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
                <input
                  type="text"
                  value={formData.attorneyAddress}
                  onChange={(e) => setFormData({ ...formData, attorneyAddress: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="רחוב, עיר, מיקוד"
                />
              </div>
            </div>
          </section>

          <section className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              סעיפים והנחיות
            </h2>
            
            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <textarea
                      value={section}
                      onChange={(e) => updateSection(index, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`סעיף ${index + 1} - תאר את ההנחיות`}
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={() => removeSection(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    הסר
                  </button>
                </div>
              ))}
              
              <button
                onClick={addSection}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                הוסף סעיף
              </button>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg">
            <button
              onClick={generateDocument}
              disabled={!formData.principalName || !formData.attorneyName}
              className="w-full px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-6 h-6" />
              ייצא מסמך הנחיות מקדימות
            </button>
            {(!formData.principalName || !formData.attorneyName) && (
              <p className="text-white text-center mt-2 text-sm">
                יש למלא לפחות שם ממנה ושם מיופה כוח
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}