'use client';

import { useState } from 'react';
import { FileSignature, User, Users, Download, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import GenderSelector from '@/components/GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';
import { replaceTextWithGender } from '@/lib/hebrew-gender';

// סוג מגדר מצומצם (ללא organization)
type PersonGender = 'male' | 'female';

// סוגי ייפוי כוח
type PowerOfAttorneyType = 'general' | 'special' | 'medical' | 'banking' | 'real_estate' | 'legal';

// סמכויות אפשריות
interface Power {
  id: string;
  name: string;
  description: string;
  category: string;
  selected: boolean;
}

interface Attorney {
  name: string;
  id: string;
  address: string;
  phone: string;
  gender: PersonGender;
  isAlternate: boolean;
}

export default function PowerOfAttorneyPage() {
  // פרטי הממנה (נותן ייפוי הכוח)
  const [principalInfo, setPrincipalInfo] = useState({
    fullName: '',
    id: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    gender: 'male' as PersonGender
  });

  // סוג ייפוי הכוח
  const [poaType, setPoaType] = useState<PowerOfAttorneyType>('general');

  // מיופי כוח
  const [attorneys, setAttorneys] = useState<Attorney[]>([
    {
      name: '',
      id: '',
      address: '',
      phone: '',
      gender: 'male',
      isAlternate: false
    }
  ]);

  // סמכויות
  const [powers, setPowers] = useState<Power[]>([
    // סמכויות כלליות
    { id: 'general_1', name: 'ייצוג מול רשויות', description: 'ייצוג מול כל הרשויות הממשלתיות והמוניציפליות', category: 'general', selected: true },
    { id: 'general_2', name: 'חתימה על מסמכים', description: 'חתימה על מסמכים משפטיים בשמי', category: 'general', selected: true },
    { id: 'general_3', name: 'קבלת מידע', description: 'קבלת כל מידע הנוגע לעניניי', category: 'general', selected: true },
    
    // סמכויות בנקאיות
    { id: 'banking_1', name: 'ניהול חשבון בנק', description: 'ניהול מלא של חשבונות הבנק שלי', category: 'banking', selected: false },
    { id: 'banking_2', name: 'משיכת כספים', description: 'משיכת כספים מחשבונות הבנק', category: 'banking', selected: false },
    { id: 'banking_3', name: 'העברות בנקאיות', description: 'ביצוע העברות בנקאיות', category: 'banking', selected: false },
    { id: 'banking_4', name: 'פתיחת/סגירת חשבון', description: 'פתיחה וסגירה של חשבונות בנק', category: 'banking', selected: false },
    
    // סמכויות נדל"ן
    { id: 'real_estate_1', name: 'מכירת נכסים', description: 'מכירת נכסי מקרקעין בשמי', category: 'real_estate', selected: false },
    { id: 'real_estate_2', name: 'רכישת נכסים', description: 'רכישת נכסי מקרקעין בשמי', category: 'real_estate', selected: false },
    { id: 'real_estate_3', name: 'השכרת נכסים', description: 'השכרת נכסים וחתימה על חוזי שכירות', category: 'real_estate', selected: false },
    { id: 'real_estate_4', name: 'רישום בטאבו', description: 'ביצוע פעולות רישום בלשכת רישום המקרקעין', category: 'real_estate', selected: false },
    
    // סמכויות רפואיות
    { id: 'medical_1', name: 'קבלת מידע רפואי', description: 'קבלת מידע רפואי מכל גורם', category: 'medical', selected: false },
    { id: 'medical_2', name: 'החלטות רפואיות', description: 'קבלת החלטות רפואיות בשמי', category: 'medical', selected: false },
    { id: 'medical_3', name: 'הסכמה לטיפולים', description: 'מתן הסכמה לטיפולים רפואיים', category: 'medical', selected: false },
    
    // סמכויות משפטיות
    { id: 'legal_1', name: 'ייצוג בבית משפט', description: 'ייצוג בהליכים משפטיים', category: 'legal', selected: false },
    { id: 'legal_2', name: 'הגשת תביעות', description: 'הגשת תביעות משפטיות בשמי', category: 'legal', selected: false },
    { id: 'legal_3', name: 'פשרות והסכמים', description: 'חתימה על הסכמי פשרה', category: 'legal', selected: false },
  ]);

  // הגבלות
  const [restrictions, setRestrictions] = useState('');

  // תוקף
  const [validity, setValidity] = useState({
    type: 'unlimited' as 'unlimited' | 'limited',
    endDate: '',
    conditions: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['general']);

  // הוספת מיופה כוח
  const addAttorney = (isAlternate: boolean = false) => {
    setAttorneys([...attorneys, {
      name: '',
      id: '',
      address: '',
      phone: '',
      gender: 'male',
      isAlternate
    }]);
  };

  // הסרת מיופה כוח
  const removeAttorney = (index: number) => {
    if (attorneys.length > 1) {
      setAttorneys(attorneys.filter((_, i) => i !== index));
    }
  };

  // עדכון פרטי מיופה כוח
  const updateAttorney = (index: number, field: keyof Attorney, value: string | PersonGender | boolean) => {
    const updated = [...attorneys];
    updated[index] = { ...updated[index], [field]: value };
    setAttorneys(updated);
  };

  // מיון מיופי כוח לראשיים וחלופיים
  const mainAttorneys = attorneys.filter(a => !a.isAlternate);
  const alternateAttorneys = attorneys.filter(a => a.isAlternate);

  // קביעת מגדר מיופה הכוח
  const getAttorneyGender = (): Gender => {
    const mainCount = mainAttorneys.length;
    if (mainCount === 0) return 'male';
    if (mainCount === 1) return mainAttorneys[0].gender;
    return 'plural';
  };

  // Toggle סמכות
  const togglePower = (powerId: string) => {
    setPowers(powers.map(p => 
      p.id === powerId ? { ...p, selected: !p.selected } : p
    ));
  };

  // Toggle קטגוריה
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // בחירה/ביטול כל הסמכויות בקטגוריה
  const toggleAllInCategory = (category: string, selected: boolean) => {
    setPowers(powers.map(p => 
      p.category === category ? { ...p, selected } : p
    ));
  };

  // קטגוריות הסמכויות
  const categories = [
    { id: 'general', name: 'סמכויות כלליות', icon: '📋' },
    { id: 'banking', name: 'סמכויות בנקאיות', icon: '🏦' },
    { id: 'real_estate', name: 'סמכויות נדל"ן', icon: '🏠' },
    { id: 'medical', name: 'סמכויות רפואיות', icon: '⚕️' },
    { id: 'legal', name: 'סמכויות משפטיות', icon: '⚖️' },
  ];

  // יצירת טקסט הסמכויות עם נטיות מגדר
  const generatePowersText = (): string => {
    const attorneyGender = getAttorneyGender();
    const selectedPowers = powers.filter(p => p.selected);
    
    if (selectedPowers.length === 0) return 'לא נבחרו סמכויות ספציפיות.';
    
    const genderedText = (text: string) => replaceTextWithGender(text, attorneyGender);
    
    // קיבוץ לפי קטגוריות
    const byCategory: Record<string, Power[]> = {};
    selectedPowers.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(p);
    });
    
    let result = '';
    Object.entries(byCategory).forEach(([catId, catPowers]) => {
      const cat = categories.find(c => c.id === catId);
      result += `**${cat?.name || catId}:**\n`;
      catPowers.forEach((p, i) => {
        result += `${i + 1}. ${p.name} - ${p.description}\n`;
      });
      result += '\n';
    });
    
    return genderedText(result);
  };

  // יצירת המסמך
  const generateDocument = (): string => {
    const attorneyGender = getAttorneyGender();
    const principalGenderSuffix = principalInfo.gender === 'female' ? 'ה' : '';
    
    // נטיות לפי מגדר מיופה הכוח
    const attorneySingular = mainAttorneys.length === 1;
    const attorneyWord = attorneySingular 
      ? (mainAttorneys[0]?.gender === 'female' ? 'מיופת' : 'מיופה')
      : 'מיופי';
    const attorneyWordFull = attorneySingular 
      ? (mainAttorneys[0]?.gender === 'female' ? 'מיופת הכוח' : 'מיופה הכוח')
      : 'מיופי הכוח';
    const beVerb = attorneySingular 
      ? (mainAttorneys[0]?.gender === 'female' ? 'תהיה רשאית' : 'יהיה רשאי')
      : 'יהיו רשאים';
    const actVerb = attorneySingular
      ? (mainAttorneys[0]?.gender === 'female' ? 'תפעל' : 'יפעל')
      : 'יפעלו';

    // סוג ייפוי הכוח
    const typeNames: Record<PowerOfAttorneyType, string> = {
      'general': 'ייפוי כוח כללי',
      'special': 'ייפוי כוח מיוחד',
      'medical': 'ייפוי כוח רפואי',
      'banking': 'ייפוי כוח בנקאי',
      'real_estate': 'ייפוי כוח לעסקאות מקרקעין',
      'legal': 'ייפוי כוח לייצוג משפטי'
    };

    const doc = `
═══════════════════════════════════════════════════════════════
                          ${typeNames[poaType]}
═══════════════════════════════════════════════════════════════

אני הח"מ:

שם מלא: ${principalInfo.fullName}
ת"ז: ${principalInfo.id}
תאריך לידה: ${principalInfo.birthDate}
כתובת: ${principalInfo.address}
טלפון: ${principalInfo.phone}
${principalInfo.email ? `דוא"ל: ${principalInfo.email}` : ''}

(להלן: "הממנ${principalGenderSuffix}" או "נותן${principalGenderSuffix} ייפוי הכוח")

מצהיר${principalGenderSuffix} ומאשר${principalGenderSuffix} בזאת כדלקמן:

═══════════════════════════════════════════════════════════════
חלק א' - ${attorneyWordFull}
═══════════════════════════════════════════════════════════════

${mainAttorneys.map((attorney, index) => {
  const num = index + 1;
  const suffix = attorney.gender === 'female' ? 'ת' : '';
  const word = attorney.gender === 'female' ? 'מיופת' : 'מיופה';
  return `${num}. ${word} כוח ראשי${suffix}:
   שם מלא: ${attorney.name}
   ת"ז: ${attorney.id}
   כתובת: ${attorney.address}
   טלפון: ${attorney.phone}`;
}).join('\n\n')}

${alternateAttorneys.length > 0 ? `
───────────────────────────────────────────────────────────────
${attorneyWord} כוח חלופי:
───────────────────────────────────────────────────────────────

${alternateAttorneys.map((attorney, index) => {
  const num = index + 1;
  const suffix = attorney.gender === 'female' ? 'ת' : '';
  const word = attorney.gender === 'female' ? 'מיופת' : 'מיופה';
  return `${num}. ${word} כוח חלופי${suffix}:
   שם מלא: ${attorney.name}
   ת"ז: ${attorney.id}
   כתובת: ${attorney.address}
   טלפון: ${attorney.phone}`;
}).join('\n\n')}

${attorneyWord} הכוח החלופי ${actVerb} במקום ${attorneyWord} הכוח הראשי במקרה שזה לא יוכל או לא ירצה לפעול.
` : ''}

═══════════════════════════════════════════════════════════════
חלק ב' - הסמכויות
═══════════════════════════════════════════════════════════════

אני ממנ${principalGenderSuffix} את ${attorneyWordFull} לפעול בשמי ובמקומי, והנני מעניק${principalGenderSuffix} ל${attorneyWordFull} את הסמכויות הבאות:

${generatePowersText()}

${attorneyWordFull} ${beVerb} לפעול בשמי בכל הקשור לסמכויות שהוענקו לעיל, לחתום על כל מסמך, להופיע בפני כל גורם, ולבצע כל פעולה הנדרשת למימוש סמכויות אלה.

${restrictions ? `
═══════════════════════════════════════════════════════════════
חלק ג' - הגבלות
═══════════════════════════════════════════════════════════════

${restrictions}
` : ''}

═══════════════════════════════════════════════════════════════
חלק ${restrictions ? 'ד' : 'ג'}' - תוקף ייפוי הכוח
═══════════════════════════════════════════════════════════════

${validity.type === 'unlimited' 
  ? `ייפוי כוח זה הינו בלתי מוגבל בזמן ויישאר בתוקף עד לביטולו בכתב על ידי הממנ${principalGenderSuffix} או עד לפטירת${principalGenderSuffix === 'ה' ? 'ה' : 'ו'}.`
  : `ייפוי כוח זה יהיה בתוקף מיום חתימתו ועד לתאריך ${validity.endDate}.
${validity.conditions ? `\nתנאים נוספים: ${validity.conditions}` : ''}`
}

═══════════════════════════════════════════════════════════════
חלק ${restrictions ? 'ה' : 'ד'}' - הצהרות
═══════════════════════════════════════════════════════════════

אני מצהיר${principalGenderSuffix} כי:

1. אני חותמ${principalGenderSuffix} על ייפוי כוח זה מרצוני החופשי, בדעה צלולה ומתוך הבנה מלאה של משמעותו.

2. אני מודע${principalGenderSuffix} לכך ש${attorneyWordFull} ${actVerb} בשמי ויחייב${mainAttorneys.length === 1 ? '' : 'ו'} אותי בפעולות${mainAttorneys.length === 1 ? 'יו' : 'יהם'}.

3. ${attorneyWordFull} אינ${mainAttorneys.length === 1 ? 'ו' : 'ם'} זכאי${mainAttorneys.length === 1 ? '' : 'ם'} לשכר עבור פעולות${mainAttorneys.length === 1 ? 'יו' : 'יהם'}, אלא אם הוסכם אחרת בכתב.

═══════════════════════════════════════════════════════════════

תאריך: ${new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})}

מקום החתימה: ________________

───────────────────────────────────────────────────────────────

חתימת הממנ${principalGenderSuffix}: __________________

───────────────────────────────────────────────────────────────

אישור עורך דין:

אני הח"מ, עו"ד ________________ (רישיון מס' ________),
מאשר/ת כי הממנ${principalGenderSuffix} חת${principalInfo.gender === 'female' ? 'מה' : 'ם'} בפני על ייפוי כוח זה,
לאחר שהסברתי ל${principalInfo.gender === 'female' ? 'ה' : 'ו'} את משמעותו והשלכותיו.

חתימת עורך הדין: __________________

תאריך: __________________

חותמת: __________________
`;
    return doc;
  };

  // הורדת המסמך
  const handleDownload = () => {
    const doc = generateDocument();
    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ייפוי_כוח_${principalInfo.fullName || 'מסמך'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // תצוגה מקדימה
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <FileSignature className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ייפוי כוח
            </h1>
            <p className="text-gray-600">
              מערכת מתקדמת עם תמיכה מלאה בנטיות מגדר
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 ${step !== 4 ? 'border-b-2' : ''} ${
                    currentStep >= step ? 'border-indigo-600' : 'border-gray-300'
                  } pb-2`}
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-600">
                    {step === 1 && 'הממנה'}
                    {step === 2 && 'מיופי כוח'}
                    {step === 3 && 'סמכויות'}
                    {step === 4 && 'סיכום'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: פרטי הממנה */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6" />
                פרטי הממנה (נותן ייפוי הכוח)
              </h2>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-800">
                  💡 <strong>חשוב:</strong> בחירת המגדר תשפיע על כל הנטיות בטקסט (אני ממנה/ממנה, מצהיר/מצהירה וכו')
                </p>
              </div>

              {/* סוג ייפוי הכוח */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סוג ייפוי הכוח *
                </label>
                <select
                  value={poaType}
                  onChange={(e) => setPoaType(e.target.value as PowerOfAttorneyType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="general">ייפוי כוח כללי</option>
                  <option value="special">ייפוי כוח מיוחד</option>
                  <option value="medical">ייפוי כוח רפואי</option>
                  <option value="banking">ייפוי כוח בנקאי</option>
                  <option value="real_estate">ייפוי כוח לעסקאות מקרקעין</option>
                  <option value="legal">ייפוי כוח לייצוג משפטי</option>
                </select>
              </div>

              {/* בחירת מגדר */}
              <GenderSelector
                value={principalInfo.gender}
                onChange={(gender) => setPrincipalInfo({ ...principalInfo, gender: gender as PersonGender })}
                label="מגדר הממנה *"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    value={principalInfo.fullName}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="שם פרטי ושם משפחה"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר תעודת זהות *
                  </label>
                  <input
                    type="text"
                    value={principalInfo.id}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תאריך לידה *
                  </label>
                  <input
                    type="date"
                    value={principalInfo.birthDate}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת מלאה *
                  </label>
                  <input
                    type="text"
                    value={principalInfo.address}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="רחוב, מספר בית, עיר, מיקוד"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    value={principalInfo.phone}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    דוא"ל
                  </label>
                  <input
                    type="email"
                    value={principalInfo.email}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: מיופי כוח */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  מיופי כוח
                </h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  💡 <strong>טיפ:</strong> ניתן להוסיף מיופה כוח חלופי שיפעל במקרה שהראשי לא יוכל
                </p>
              </div>

              {/* מיופי כוח ראשיים */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">מיופי כוח ראשיים</h3>
                  <button
                    onClick={() => addAttorney(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    הוסף מיופה כוח ראשי
                  </button>
                </div>

                {mainAttorneys.map((attorney, index) => {
                  const realIndex = attorneys.findIndex(a => a === attorney);
                  return (
                    <div key={realIndex} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-md font-semibold text-gray-800">
                          מיופה כוח ראשי #{index + 1}
                        </h4>
                        {mainAttorneys.length > 1 && (
                          <button
                            onClick={() => removeAttorney(realIndex)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            הסר
                          </button>
                        )}
                      </div>

                      <GenderSelector
                        value={attorney.gender}
                        onChange={(gender) => updateAttorney(realIndex, 'gender', gender as PersonGender)}
                        label="מגדר מיופה הכוח *"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
                          <input
                            type="text"
                            value={attorney.name}
                            onChange={(e) => updateAttorney(realIndex, 'name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ת"ז *</label>
                          <input
                            type="text"
                            value={attorney.id}
                            onChange={(e) => updateAttorney(realIndex, 'id', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">טלפון *</label>
                          <input
                            type="tel"
                            value={attorney.phone}
                            onChange={(e) => updateAttorney(realIndex, 'phone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">כתובת *</label>
                          <input
                            type="text"
                            value={attorney.address}
                            onChange={(e) => updateAttorney(realIndex, 'address', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* מיופי כוח חלופיים */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">מיופי כוח חלופיים (אופציונלי)</h3>
                  <button
                    onClick={() => addAttorney(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    הוסף מיופה כוח חלופי
                  </button>
                </div>

                {alternateAttorneys.length === 0 && (
                  <p className="text-gray-500 text-sm italic">לא הוספו מיופי כוח חלופיים</p>
                )}

                {alternateAttorneys.map((attorney, index) => {
                  const realIndex = attorneys.findIndex(a => a === attorney);
                  return (
                    <div key={realIndex} className="border border-dashed border-gray-300 rounded-lg p-6 space-y-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h4 className="text-md font-semibold text-gray-700">
                          מיופה כוח חלופי #{index + 1}
                        </h4>
                        <button
                          onClick={() => removeAttorney(realIndex)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          הסר
                        </button>
                      </div>

                      <GenderSelector
                        value={attorney.gender}
                        onChange={(gender) => updateAttorney(realIndex, 'gender', gender as PersonGender)}
                        label="מגדר *"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
                          <input
                            type="text"
                            value={attorney.name}
                            onChange={(e) => updateAttorney(realIndex, 'name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ת"ז *</label>
                          <input
                            type="text"
                            value={attorney.id}
                            onChange={(e) => updateAttorney(realIndex, 'id', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">טלפון *</label>
                          <input
                            type="tel"
                            value={attorney.phone}
                            onChange={(e) => updateAttorney(realIndex, 'phone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">כתובת *</label>
                          <input
                            type="text"
                            value={attorney.address}
                            onChange={(e) => updateAttorney(realIndex, 'address', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: סמכויות */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                סמכויות והרשאות
              </h2>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-800">
                  ✅ בחר את הסמכויות שברצונך להעניק למיופה הכוח
                </p>
              </div>

              {/* קטגוריות סמכויות */}
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryPowers = powers.filter(p => p.category === category.id);
                  const selectedCount = categoryPowers.filter(p => p.selected).length;
                  const isExpanded = expandedCategories.includes(category.id);
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-semibold text-gray-800">{category.name}</span>
                          <span className="text-sm text-gray-500">
                            ({selectedCount}/{categoryPowers.length} נבחרו)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAllInCategory(category.id, selectedCount !== categoryPowers.length);
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            {selectedCount === categoryPowers.length ? 'בטל הכל' : 'בחר הכל'}
                          </button>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 space-y-3">
                          {categoryPowers.map((power) => (
                            <label 
                              key={power.id} 
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={power.selected}
                                onChange={() => togglePower(power.id)}
                                className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <div>
                                <div className="font-medium text-gray-800">{power.name}</div>
                                <div className="text-sm text-gray-500">{power.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* הגבלות */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הגבלות על סמכויות (אופציונלי)
                </label>
                <textarea
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="הגבלות או תנאים מיוחדים..."
                />
              </div>

              {/* תוקף */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  תוקף ייפוי הכוח
                </label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={validity.type === 'unlimited'}
                      onChange={() => setValidity({ ...validity, type: 'unlimited' })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>ללא הגבלת זמן</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={validity.type === 'limited'}
                      onChange={() => setValidity({ ...validity, type: 'limited' })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>מוגבל בזמן</span>
                  </label>
                </div>
                
                {validity.type === 'limited' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">תאריך סיום</label>
                      <input
                        type="date"
                        value={validity.endDate}
                        onChange={(e) => setValidity({ ...validity, endDate: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">תנאים נוספים</label>
                      <input
                        type="text"
                        value={validity.conditions}
                        onChange={(e) => setValidity({ ...validity, conditions: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="תנאים לסיום מוקדם..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  המשך לסיכום →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: סיכום */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                סיכום ותצוגה מקדימה
              </h2>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">📋 סיכום פרטים:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">הממנה: </span>
                    <span className="text-sm text-gray-900">{principalInfo.fullName || '(לא הוזן)'}</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded mr-2">
                      {principalInfo.gender === 'male' ? 'זכר' : 'נקבה'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">סוג ייפוי כוח: </span>
                    <span className="text-sm text-gray-900">
                      {poaType === 'general' && 'כללי'}
                      {poaType === 'special' && 'מיוחד'}
                      {poaType === 'medical' && 'רפואי'}
                      {poaType === 'banking' && 'בנקאי'}
                      {poaType === 'real_estate' && 'נדל"ן'}
                      {poaType === 'legal' && 'משפטי'}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">מיופי כוח ראשיים: </span>
                    <span className="text-sm text-gray-900">{mainAttorneys.length}</span>
                    {mainAttorneys.length > 1 && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded mr-2">רבים</span>
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">מיופי כוח חלופיים: </span>
                    <span className="text-sm text-gray-900">{alternateAttorneys.length}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-600">סמכויות שנבחרו: </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {powers.filter(p => p.selected).length} סמכויות
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-600">תוקף: </span>
                    <span className="text-sm text-gray-900">
                      {validity.type === 'unlimited' ? 'ללא הגבלה' : `עד ${validity.endDate}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* תצוגה מקדימה */}
              <div className="border border-gray-300 rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <span className="font-semibold text-gray-800">📄 תצוגה מקדימה של המסמך</span>
                  {showPreview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
                
                {showPreview && (
                  <div className="p-6 max-h-96 overflow-y-auto bg-white">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-right" style={{ direction: 'rtl' }}>
                      {generateDocument()}
                    </pre>
                  </div>
                )}
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

