'use client';

import { useState } from 'react';
import { FileText, User, Users, Download } from 'lucide-react';

export default function AdvanceDirectivesForm() {
  const [formData, setFormData] = useState({
    // פרטי מצהיר
    fullName: '',
    id: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    
    // מיופה כוח ראשי
    primaryAttorney: {
      name: '',
      id: '',
      relationship: '',
      address: '',
      phone: ''
    },
    
    // מיופה כוח חלופי
    alternateAttorney: {
      name: '',
      id: '',
      relationship: '',
      address: '',
      phone: ''
    },
    
    // הנחיות רפואיות
    medicalInstructions: '',
    
    // הנחיות נכסים
    propertyInstructions: '',
    
    // הוראות מיוחדות
    specialInstructions: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: 'primaryAttorney' | 'alternateAttorney', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const generateDocument = () => {
    const doc = `
צוואה חיה וייפוי כוח מתמשך

אני הח"מ:
שם: ${formData.fullName}
ת.ז: ${formData.id}
תאריך לידה: ${formData.birthDate}
כתובת: ${formData.address}
טלפון: ${formData.phone}
אימייל: ${formData.email}

מצהיר/ה בזאת כדלקמן:

1. מיופה כוח ראשי:
שם: ${formData.primaryAttorney.name}
ת.ז: ${formData.primaryAttorney.id}
יחסי קרבה: ${formData.primaryAttorney.relationship}
כתובת: ${formData.primaryAttorney.address}
טלפון: ${formData.primaryAttorney.phone}

2. מיופה כוח חלופי:
שם: ${formData.alternateAttorney.name}
ת.ז: ${formData.alternateAttorney.id}
יחסי קרבה: ${formData.alternateAttorney.relationship}
כתובת: ${formData.alternateAttorney.address}
טלפון: ${formData.alternateAttorney.phone}

3. הנחיות רפואיות:
${formData.medicalInstructions}

4. הנחיות לניהול נכסים:
${formData.propertyInstructions}

5. הוראות מיוחדות:
${formData.specialInstructions}

תאריך: ${new Date().toLocaleDateString('he-IL')}

חתימת המצהיר/ה: __________________
`;
    return doc;
  };

  const handleDownload = () => {
    const doc = generateDocument();
    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `צוואה_חיה_${formData.fullName || 'מסמך'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              צוואה חיה וייפוי כוח מתמשך
            </h1>
            <p className="text-gray-600">
              מלא/י את הפרטים כדי ליצור צוואה חיה וייפוי כוח מתמשך
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 ${step !== 4 ? 'border-b-2' : ''} ${
                    currentStep >= step ? 'border-blue-600' : 'border-gray-300'
                  } pb-2`}
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: פרטים אישיים */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6" />
                פרטים אישיים
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="שם פרטי ושם משפחה"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר תעודת זהות *
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => updateField('id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תאריך לידה *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="050-1234567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת מלאה *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="רחוב, מספר בית, עיר, מיקוד"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: מיופה כוח ראשי */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                מיופה כוח ראשי
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryAttorney.name}
                    onChange={(e) => updateNestedField('primaryAttorney', 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר תעודת זהות *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryAttorney.id}
                    onChange={(e) => updateNestedField('primaryAttorney', 'id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    יחסי קרבה *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryAttorney.relationship}
                    onChange={(e) => updateNestedField('primaryAttorney', 'relationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="בן/בת, אח/אחות, וכו'"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    value={formData.primaryAttorney.phone}
                    onChange={(e) => updateNestedField('primaryAttorney', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryAttorney.address}
                    onChange={(e) => updateNestedField('primaryAttorney', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: מיופה כוח חלופי */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                מיופה כוח חלופי
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  💡 מומלץ למנות מיופה כוח חלופי למקרה שהמיופה כוח הראשי לא יוכל למלא את תפקידו
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    value={formData.alternateAttorney.name}
                    onChange={(e) => updateNestedField('alternateAttorney', 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר תעודת זהות
                  </label>
                  <input
                    type="text"
                    value={formData.alternateAttorney.id}
                    onChange={(e) => updateNestedField('alternateAttorney', 'id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    יחסי קרבה
                  </label>
                  <input
                    type="text"
                    value={formData.alternateAttorney.relationship}
                    onChange={(e) => updateNestedField('alternateAttorney', 'relationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    value={formData.alternateAttorney.phone}
                    onChange={(e) => updateNestedField('alternateAttorney', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת
                  </label>
                  <input
                    type="text"
                    value={formData.alternateAttorney.address}
                    onChange={(e) => updateNestedField('alternateAttorney', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: הנחיות */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                הנחיות והוראות
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הנחיות רפואיות
                </label>
                <textarea
                  value={formData.medicalInstructions}
                  onChange={(e) => updateField('medicalInstructions', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="הנחיות לגבי טיפולים רפואיים, החייאה, וכו'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הנחיות לניהול נכסים
                </label>
                <textarea
                  value={formData.propertyInstructions}
                  onChange={(e) => updateField('propertyInstructions', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="הנחיות לגבי ניהול נכסים, חשבונות בנק, וכו'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הוראות מיוחדות
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => updateField('specialInstructions', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="הוראות נוספות שברצונך לכלול"
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  הורד מסמך
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
