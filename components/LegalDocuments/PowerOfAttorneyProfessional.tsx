'use client';

import { useState } from 'react';
import { FileText, User, Shield, Calendar, Plus, X } from 'lucide-react';
import GenderSelector from '../GenderSelector';
import SimpleExportButtons from '../SimpleExportButtons';
import SimpleAIImprover from '../SimpleAIImprover';
import type { Gender } from '@/lib/hebrew-gender';
import { applyGenderToText } from '@/lib/hebrew-gender';

interface Authority {
  description: string;
  scope: 'מוגבל' | 'כללי' | 'מיוחד';
  limitations?: string;
}

export default function PowerOfAttorneyProfessional() {
  // נותן הייפוי כוח
  const [grantor, setGrantor] = useState({
    name: '',
    id: '',
    address: '',
    phone: '',
    gender: 'male' as Gender
  });

  // בא כוח
  const [attorney, setAttorney] = useState({
    name: '',
    id: '',
    address: '',
    phone: '',
    relationship: '',
    gender: 'male' as Gender // הוספת מגדר לבא כוח
  });

  // בא כוח חלופי
  const [alternateAttorney, setAlternateAttorney] = useState({
    name: '',
    id: '',
    address: '',
    phone: '',
    gender: 'male' as Gender // הוספת מגדר לבא כוח חלופי
  });

  const [powerType, setPowerType] = useState<'כללי' | 'מיוחד'>('כללי');
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [validityPeriod, setValidityPeriod] = useState('');
  const [isRevocable, setIsRevocable] = useState(true);
  const [specialConditions, setSpecialConditions] = useState('');
  const [signingDate, setSigningDate] = useState(new Date().toISOString().split('T')[0]);
  const [signingLocation, setSigningLocation] = useState('');
  const [notaryName, setNotaryName] = useState('');
  const [showAI, setShowAI] = useState(false);

  const addAuthority = () => {
    setAuthorities(prev => [...prev, { description: '', scope: 'כללי', limitations: '' }]);
  };

  const removeAuthority = (index: number) => {
    setAuthorities(prev => prev.filter((_, i) => i !== index));
  };

  const generatePowerOfAttorney = (): string => {
    // התאמת טקסט למגדר נותן הייפוי כוח
    const grantorText = grantor.gender === 'female' 
      ? 'בהיותי בדעה צלולה ומרצוני החופשי, הנני ממנה בזאת'
      : 'בהיותי בדעה צלולה ומרצוני החופשי, הנני ממנה בזאת';
    
    const grantorLabel = grantor.gender === 'female' ? 'המייפה' : 'המייפה';
    
    // התאמת טקסט למגדר בא הכוח
    const attorneyLabel = attorney.gender === 'female' ? 'בת הכוח' : 'בא הכוח';
    const attorneyRelationText = attorney.relationship 
      ? `(${attorney.gender === 'female' ? 'קרבתה' : 'קרבתו'} אלי: ${attorney.relationship})`
      : '';
    
    // התאמת טקסט למגדר בא כוח חלופי
    const altAttorneyText = alternateAttorney.gender === 'female'
      ? 'ובמקרה שהיא לא תוכל לפעול, אני ממנה כבת כוח חלופית'
      : 'ובמקרה שהוא לא יוכל לפעול, אני ממנה כבא כוח חלופי';
    const altAttorneyLabel = alternateAttorney.gender === 'female' ? 'בת הכוח החלופית' : 'בא הכוח החלופי';
    
    return `ייפוי כוח ${powerType}

אני הח"מ ${grantor.name || '[שם נותן הייפוי כוח]'}, ת.ז. ${grantor.id || '[תעודת זהות]'}, מכתובת: ${grantor.address || '[כתובת מלאה]'}, טלפון: ${grantor.phone || '[מספר טלפון]'}

(להלן: "${grantorLabel}")

${grantorText} את:

${attorney.name || '[שם בא הכוח]'}, ת.ז. ${attorney.id || '[תעודת זהות]'}, מכתובת: ${attorney.address || '[כתובת מלאה]'}, טלפון: ${attorney.phone || '[מספר טלפון]'}
${attorneyRelationText}

(להלן: "${attorneyLabel}")

${alternateAttorney.name ? `
${altAttorneyText} את:

${alternateAttorney.name}, ת.ז. ${alternateAttorney.id || '[תעודת זהות]'}, מכתובת: ${alternateAttorney.address || '[כתובת מלאה]'}, טלפון: ${alternateAttorney.phone || '[מספר טלפון]'}

(להלן: "${altAttorneyLabel}")
` : ''}

היקף הסמכויות

אני ${grantor.gender === 'female' ? 'מייפה' : 'מייפה'} את ${attorney.gender === 'female' ? 'כוחה של בת' : 'כוחו של בא'} הכוח לפעול בשמי ומטעמי ${powerType === 'כללי' ? 'בכל עניין שיידרש' : 'בעניינים המפורטים להלן'}:

${powerType === 'כללי' ? `
1. לחתום על כל מסמך, הסכם, או מסמך משפטי מכל סוג שהוא
2. לייצג אותי בפני כל רשות, מוסד, בנק, או גורם ממשלתי או פרטי
3. לקבל כספים, לשלם חובות, ולבצע עסקאות כספיות בשמי
4. לקנות ולמכור נכסים, לחתום על חוזי מכר ורכש
5. לטפל בכל עניין בנקאי, לרבות פתיחה וסגירה של חשבונות
6. לייצג אותי בהליכים משפטיים, לרבות הגשת תביעות והגנה
7. לבצע כל פעולה אחרת הנדרשת לטובתי ולטובת עניינים
` : ''}

${authorities.length > 0 ? `
סמכויות ספציפיות:
${authorities.map((auth, index) => `
${index + 1}. ${applyGenderToText(auth.description, attorney.gender)}
   היקף: ${auth.scope}
   ${auth.limitations ? `הגבלות: ${applyGenderToText(auth.limitations, attorney.gender)}` : ''}
`).join('')}
` : ''}

תנאים והגבלות

${specialConditions ? applyGenderToText(specialConditions, attorney.gender) : `
1. ${attorneyLabel} ${attorney.gender === 'female' ? 'תפעל' : 'יפעל'} בתום לב ולטובתי בכל עת
2. בא הכוח יידע אותי על כל פעולה משמעותית לפני ביצועها
3. ${attorneyLabel} לא ${attorney.gender === 'female' ? 'תקבל' : 'יקבל'} החלטות העלולות לפגוע באינטרסים שלי
4. ${attorneyLabel} ${attorney.gender === 'female' ? 'תנהל' : 'ינהל'} תיעוד של כל פעולה ${attorney.gender === 'female' ? 'שביצעה' : 'שביצע'} בשמי
`}

תוקף הייפוי כוח

${validityPeriod ? `
תוקף: ייפוי כוח זה תקף עד תאריך ${validityPeriod} או עד לביטולו על ידי.
` : `
תוקף: ייפוי כוח זה תקף ללא הגבלת זמן עד לביטולו על ידי.
`}

${isRevocable ? `
ביטול: אני ${grantor.gender === 'female' ? 'שומרת' : 'שומר'} לעצמי את הזכות לבטל ייפוי כוח זה בכל עת על ידי הודעה בכתב ל${attorneyLabel} ולגורמים הרלוונטיים.
` : `
אי הדירות: ייפוי כוח זה הוא בלתי הדיר ולא ניתן לביטול, למעט במקרים הקבועים בחוק.
`}

אחריות וחבות

1. ${attorneyLabel} ${attorney.gender === 'female' ? 'תהיה אחראית' : 'יהיה אחראי'} לכל נזק ${attorney.gender === 'female' ? 'שיגרם' : 'שיגרם'} כתוצאה ${attorney.gender === 'female' ? 'מרשלנותה' : 'מרשלנותו'} או מפעולה שלא בתום לב

2. אני ${grantor.gender === 'female' ? 'מתחייבת' : 'מתחייב'} לפצות את ${attorneyLabel} עבור הוצאות סבירות ${attorney.gender === 'female' ? 'שייגרמו לה' : 'שייגרמו לו'} במסגרת ביצוע התפקיד

3. ${attorneyLabel} לא ${attorney.gender === 'female' ? 'תישא' : 'יישא'} באחריות לנזקים שנגרמו שלא כתוצאה ${attorney.gender === 'female' ? 'מרשלנותה' : 'מרשלנותו'}

הצהרות

אני ${grantor.gender === 'female' ? 'מצהירה' : 'מצהיר'} בזה כי:
1. אני ${grantor.gender === 'female' ? 'כשירה' : 'כשיר'} לתת ייפוי כוח זה מבחינה משפטית ונפשית
2. ${grantor.gender === 'female' ? 'נתתי' : 'נתתי'} ייפוי כוח זה מרצוני החופשי וללא כל כפייה
3. ${grantor.gender === 'female' ? 'הבנתי' : 'הבנתי'} את המשמעויות המשפטיות של ייפוי כוח זה
4. אני ${grantor.gender === 'female' ? 'מכירה' : 'מכיר'} את ${attorneyLabel} ו${grantor.gender === 'female' ? 'בוטחת' : 'בוטח'} ${attorney.gender === 'female' ? 'בה' : 'בו'} לפעול לטובתי

נחתם היום ${new Date(signingDate).toLocaleDateString('he-IL')} במקום: ${signingLocation || '[מקום החתימה]'}

לפני: ${notaryName || '[שם הנוטריון/עו״ד המאשר]'}

________________________
     חתימת המייפה
   ${grantor.name || '[שם]'}

________________________
     חתימת בא הכוח  
   ${attorney.name || '[שם]'}

אישור נוטריון/עו״ד:
אני הח"מ מאשר/ת בזה כי ${grantorLabel} ${grantor.name || '[שם]'} ${grantor.gender === 'female' ? 'חתמה' : 'חתם'} בפני על ייפוי כוח זה לאחר ${grantor.gender === 'female' ? 'שהסברתי לה' : 'שהסברתי לו'} את משמעותו, ו${grantor.gender === 'female' ? 'היא הצהירה' : 'הוא הצהיר'} כי ${grantor.gender === 'female' ? 'נותנת' : 'נותן'} אותו ${grantor.gender === 'female' ? 'מרצונה' : 'מרצונו'} החופשי.

תאריך: ${new Date(signingDate).toLocaleDateString('he-IL')}

________________________
חתימה וחותמת נוטריון/עו״ד
${notaryName || '[שם]'}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          ייפוי כוח מקצועי
        </h1>

        {/* סוג ייפוי כוח */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">סוג ייפוי כוח</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setPowerType('כללי')}
              className={`p-4 border-2 rounded-lg transition ${
                powerType === 'כללי' 
                  ? 'border-blue-500 bg-blue-100 text-blue-900' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">ייפוי כוח כללי</div>
              <div className="text-sm text-gray-600">סמכויות רחבות לכל עניין</div>
            </button>
            
            <button
              onClick={() => setPowerType('מיוחד')}
              className={`p-4 border-2 rounded-lg transition ${
                powerType === 'מיוחד' 
                  ? 'border-blue-500 bg-blue-100 text-blue-900' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">ייפוי כוח מיוחד</div>
              <div className="text-sm text-gray-600">סמכויות מוגבלות לעניין ספציפי</div>
            </button>
          </div>
        </section>

        {/* נותן הייפוי כוח */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            פרטי נותן ייפוי הכוח
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={grantor.name}
              onChange={(e) => setGrantor(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם מלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={grantor.id}
              onChange={(e) => setGrantor(prev => ({ ...prev, id: e.target.value }))}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={grantor.address}
              onChange={(e) => setGrantor(prev => ({ ...prev, address: e.target.value }))}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={grantor.phone}
              onChange={(e) => setGrantor(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
            />
          </div>

          <GenderSelector
            value={grantor.gender}
            onChange={(gender) => setGrantor(prev => ({ ...prev, gender }))}
            label="מגדר נותן ייפוי הכוח"
            size="medium"
          />
        </section>

        {/* בא כוח ראשי */}
        <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">פרטי בא הכוח הראשי</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={attorney.name}
              onChange={(e) => setAttorney(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם מלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={attorney.id}
              onChange={(e) => setAttorney(prev => ({ ...prev, id: e.target.value }))}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={attorney.address}
              onChange={(e) => setAttorney(prev => ({ ...prev, address: e.target.value }))}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={attorney.phone}
              onChange={(e) => setAttorney(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              dir="ltr"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={attorney.relationship}
              onChange={(e) => setAttorney(prev => ({ ...prev, relationship: e.target.value }))}
              placeholder="קרבה (בן/בת, אח/אחות, עו״ד...)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              dir="rtl"
            />
            
            <div>
              <GenderSelector
                value={attorney.gender}
                onChange={(gender) => setAttorney(prev => ({ ...prev, gender }))}
                label="מגדר בא הכוח"
                size="medium"
              />
            </div>
          </div>
        </section>

        {/* בא כוח חלופי */}
        <section className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
          <h2 className="text-xl font-bold text-orange-900 mb-4">בא כוח חלופי (אופציונלי)</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={alternateAttorney.name}
              onChange={(e) => setAlternateAttorney(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם מלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={alternateAttorney.id}
              onChange={(e) => setAlternateAttorney(prev => ({ ...prev, id: e.target.value }))}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={alternateAttorney.address}
              onChange={(e) => setAlternateAttorney(prev => ({ ...prev, address: e.target.value }))}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={alternateAttorney.phone}
              onChange={(e) => setAlternateAttorney(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              dir="ltr"
            />
          </div>
          
          <GenderSelector
            value={alternateAttorney.gender}
            onChange={(gender) => setAlternateAttorney(prev => ({ ...prev, gender }))}
            label="מגדר בא כוח חלופי"
            size="medium"
          />
        </section>

        {/* סמכויות ספציפיות */}
        {powerType === 'מיוחד' && (
          <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-900">סמכויות ספציפיות</h2>
              <button
                onClick={addAuthority}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                הוסף סמכות
              </button>
            </div>

            <div className="space-y-4">
              {authorities.map((authority, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-300">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">סמכות {index + 1}</h3>
                    <button
                      onClick={() => removeAuthority(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <textarea
                      value={authority.description}
                      onChange={(e) => {
                        const newAuthorities = [...authorities];
                        newAuthorities[index].description = e.target.value;
                        setAuthorities(newAuthorities);
                      }}
                      placeholder="תיאור הסמכות (למשל: לחתום על הסכם מכר דירה)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                      rows={2}
                      dir="rtl"
                    />
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <select
                        value={authority.scope}
                        onChange={(e) => {
                          const newAuthorities = [...authorities];
                          newAuthorities[index].scope = e.target.value as any;
                          setAuthorities(newAuthorities);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="כללי">כללי</option>
                        <option value="מוגבל">מוגבל</option>
                        <option value="מיוחד">מיוחד</option>
                      </select>
                      
                      <input
                        type="text"
                        value={authority.limitations || ''}
                        onChange={(e) => {
                          const newAuthorities = [...authorities];
                          newAuthorities[index].limitations = e.target.value;
                          setAuthorities(newAuthorities);
                        }}
                        placeholder="הגבלות (אופציונלי)"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* תוקף ותנאים */}
        <section className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
          <h2 className="text-xl font-bold text-red-900 mb-4">תוקף ותנאים</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תוקף עד (אופציונלי)</label>
              <input
                type="date"
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRevocable}
                  onChange={(e) => setIsRevocable(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">ייפוי כוח הדיר</div>
                  <div className="text-sm text-gray-600">ניתן לביטול בכל עת</div>
                </div>
              </label>
            </div>
          </div>

          <textarea
            value={specialConditions}
            onChange={(e) => setSpecialConditions(e.target.value)}
            placeholder="תנאים מיוחדים, הגבלות, הוראות נוספות..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
            rows={4}
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </section>

        {/* פרטי חתימה */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            פרטי חתימה ואישור
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="date"
              value={signingDate}
              onChange={(e) => setSigningDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
            />
            
            <input
              type="text"
              value={signingLocation}
              onChange={(e) => setSigningLocation(e.target.value)}
              placeholder="מקום החתימה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={notaryName}
              onChange={(e) => setNotaryName(e.target.value)}
              placeholder="שם נוטריון/עו״ד מאשר"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
          </div>
        </section>

        {/* עוזר AI */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">🤖 עוזר AI לשיפור תנאים</h2>
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              {showAI ? 'הסתר AI' : 'הצג AI'}
            </button>
          </div>
          
          {showAI && (
            <SimpleAIImprover
              initialText={specialConditions || 'כתוב כאן תנאים או הגבלות בסיסיים והAI ירחיב לניסוח משפטי מקצועי'}
              onAccept={(improvedText) => setSpecialConditions(improvedText)}
              placeholder="לדוגמה: בא הכוח יכול לחתום רק על הסכמים עד 100,000 שח..."
            />
          )}
        </section>

        {/* ייצוא */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <SimpleExportButtons
            documentContent={generatePowerOfAttorney()}
            documentTitle={`ייפוי כוח ${powerType} - ${attorney.name || 'בא כוח'}`}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
