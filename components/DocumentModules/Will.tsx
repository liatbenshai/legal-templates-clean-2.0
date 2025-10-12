'use client';

import { useState } from 'react';
import { FileText, User, Plus, Sparkles, Eye, X } from 'lucide-react';
import RepeatableFieldGroup from '../RepeatableFieldGroup';
import SignatureList from '../SignatureList';
import SimpleExportButtons from '../SimpleExportButtons';
import SimpleAIImprover from '../SimpleAIImprover';
import { SignatureData } from '../SignatureBlock';
import GenderSelector from '../GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';
import { standardWillSections, generateFullWill } from '@/lib/legal-templates-text';
import StandardSectionsSelector from '../StandardSectionsSelector';

/**
 * מודול צוואת יחיד
 * מודולרי, עצמאי, קל לשינוי
 */

interface WillProps {
  onGenerate: (document: any) => void;
}

export default function Will({ onGenerate }: WillProps) {
  const [testatorInfo, setTestatorInfo] = useState({
    name: '',
    idNumber: '',
    address: '',
    birthDate: '',
    gender: 'male' as Gender,
  });

  const [heirs, setHeirs] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  
  const [executorInfo, setExecutorInfo] = useState({
    name: '',
    idNumber: '',
    relationship: '',
  });

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [burialInstructions, setBurialInstructions] = useState('');
  const [cancelPreviousWills, setCancelPreviousWills] = useState(true);
  const [additionalSections, setAdditionalSections] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedStandardSections, setSelectedStandardSections] = useState<string[]>([
    'will-opening',
    'cancel-previous-wills', 
    'estate-debts',
    'estate-scope',
    'inheritance-distribution',
    'heir-death-scenario',
    'contest-clause',
    'will-validity',
    'signature-declaration',
    'witnesses-declaration'
  ]);
  const [aiTextToImprove, setAiTextToImprove] = useState('');
  
  const [signatures, setSignatures] = useState<SignatureData[]>([
    {
      id: 'testator',
      signerName: '',
      signerRole: 'מצווה',
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
  ]);

  const generateWillContent = () => {
    const data = {
      testator_name: testatorInfo.name || '[שם המצווה]',
      testator_id: testatorInfo.idNumber || '[תעודת זהות]',
      testator_address: testatorInfo.address || '[כתובת המצווה]',
      gender: testatorInfo.gender,
      heirs: heirs.length > 0 ? heirs.map(heir => ({
        name: heir.name || '[שם יורש]',
        idNumber: heir.idNumber || '[תעודת זהות יורש]',
        relationship: heir.relationship || '[קרבת משפחה]',
        percentage: heir.percentage || 0
      })) : [],
      executor: executorInfo.name ? {
        name: executorInfo.name,
        idNumber: executorInfo.idNumber,
        relationship: executorInfo.relationship
      } : null,
      special_instructions: specialInstructions,
      burial_instructions: burialInstructions,
      additional_sections: additionalSections.filter(s => s.trim()),
      signing_city: 'תל אביב',
      signing_day: 'רביעי',
      signing_month: 'אוקטובר',
      signing_year: 'תשפ"ה',
      witness1_name: signatures.find(s => s.signerRole === 'עד ראשון')?.signerName || '[שם עד ראשון]',
      witness1_id: '123456789',
      witness1_address: '[כתובת עד ראשון]',
      witness2_name: signatures.find(s => s.signerRole === 'עד שני')?.signerName || '[שם עד שני]',
      witness2_id: '987654321', 
      witness2_address: '[כתובת עד שני]',
      lawyer_name: signatures.find(s => s.signerRole === 'עורך דין')?.signerName || null,
      selectedStandardSections: selectedStandardSections
    };

    // יצירת צוואה מלאה עם הסעיפים הנבחרים
    return generateFullWillWithSelectedSections(data, selectedStandardSections);
  };

  const generateFullWillWithSelectedSections = (data: any, selectedSections: string[]): string => {
    let content = '';
    let sectionCounter = 1;
    
    // כותרת ופתיחה
    content += 'צוואה\n\n';
    
    // פרטי המצווה
    content += `אני הח"מ ${data.testator_name}, ת.ז. ${data.testator_id}, מכתובת: ${data.testator_address}.\n\n`;
    
    if (data.gender === 'female') {
      content += 'בהיותי בדעה צלולה ובבריאות הנפש, מצווה בזה צוואתי האחרונה:\n\n';
    } else {
      content += 'בהיותי בדעה צלולה ובבריאות הנפש, מצווה בזה צוואתי האחרונה:\n\n';
    }

    // 1. ביטול צוואות קודמות
    if (selectedSections.includes('cancel-previous-wills')) {
      content += `${sectionCounter}. ביטול צוואות קודמות\n`;
      content += 'אני מבטל בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי.\n\n';
      sectionCounter++;
    }

    // 2. תשלום חובות
    if (selectedSections.includes('estate-debts')) {
      content += `${sectionCounter}. תשלום חובות העיזבון\n`;
      content += 'אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.\n\n';
      sectionCounter++;
    }

    // 3. היקף העיזבון
    if (selectedSections.includes('estate-scope')) {
      content += `${sectionCounter}. היקף העיזבון\n`;
      content += 'צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים.\n\n';
      sectionCounter++;
    }

    // 4. ירושה
    if (selectedSections.includes('inheritance-distribution')) {
      content += `${sectionCounter}. חלוקת הירושה\n`;
      content += 'הנני מצווה ומוריש את כל רכושי ונכסיי כמפורט לעיל, ליורשים הבאים:\n\n';
      
      if (data.heirs && data.heirs.length > 0) {
        data.heirs.forEach((heir: any, index: number) => {
          content += `${index + 1}. ${heir.name} (ת.ז. ${heir.idNumber}) - ${heir.relationship} - חלק של ${heir.percentage}%\n`;
        });
        content += '\n';
      } else {
        content += '[יש להוסיף יורשים בטבלה למעלה]\n\n';
      }
      sectionCounter++;
    }

    // 5. מנהל עיזבון
    if (selectedSections.includes('executor-appointment') && data.executor) {
      content += `${sectionCounter}. מינוי מנהל עיזבון\n`;
      content += `אני ממנה בזה את ${data.executor.name} (ת.ז. ${data.executor.idNumber}) כמנהל עיזבוני.\n`;
      content += 'מנהל העיזבון יהיה מוסמך לבצע כל פעולה הדרושה לביצוע צוואתי, לרבות מימוש נכסים, תשלום חובות, וביצוע החלוקה.\n\n';
      sectionCounter++;
    }

    // 6. הוראות מיוחדות
    if (data.special_instructions && data.special_instructions.trim()) {
      content += `${sectionCounter}. הוראות מיוחדות\n`;
      content += `${data.special_instructions}\n\n`;
      sectionCounter++;
    }

    // 7. הוראות קבורה
    if (data.burial_instructions && data.burial_instructions.trim()) {
      content += `${sectionCounter}. הוראות קבורה\n`;
      content += `${data.burial_instructions}\n\n`;
      sectionCounter++;
    }

    // 8. סעיפים נוספים
    if (data.additional_sections && data.additional_sections.length > 0) {
      data.additional_sections.forEach((section: string, index: number) => {
        if (section.trim()) {
          content += `${sectionCounter + index}. ${section}\n\n`;
        }
      });
      sectionCounter += data.additional_sections.length;
    }

    // 9. מקרה פטירת יורש
    if (selectedSections.includes('heir-death-scenario')) {
      content += `${sectionCounter}. מקרה פטירת יורש\n`;
      content += 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים על פי דין.\n\n';
      sectionCounter++;
    }

    // 10. סעיף התנגדות
    if (selectedSections.includes('contest-clause')) {
      content += `${sectionCounter}. התנגדות לצוואה\n`;
      content += 'כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד.\n\n';
      sectionCounter++;
    }

    // 11. תוקף הצוואה
    if (selectedSections.includes('will-validity')) {
      content += `${sectionCounter}. תוקף הצוואה\n`;
      content += 'צוואה זו נכתבה בהיותי בדעה צלולה, ללא כל לחץ או השפעה בלתי הוגנת, ומתוך החלטה חופשית ומושכלת.\n\n';
      sectionCounter++;
    }

    // חתימה וסיום
    if (selectedSections.includes('signature-declaration')) {
      content += 'חתימה\n';
      content += `נחתם בעיר: ${data.signing_city}, היום ${data.signing_day} בחודש ${data.signing_month}, ${data.signing_year}.\n\n`;
      content += `${data.testator_name}\n`;
      content += 'חתימת המצווה: ________________\n\n';
    }

    // עדים
    if (selectedSections.includes('witnesses-declaration')) {
      content += 'עדים\n\n';
      content += 'אנו הח"מ:\n';
      content += `1. ${data.witness1_name}, ת"ז ${data.witness1_id}, מרחוב: ${data.witness1_address}\n`;
      content += `2. ${data.witness2_name}, ת"ז ${data.witness2_id}, מרחוב: ${data.witness2_address}\n\n`;
      content += `אנו מעידים בזאת שהמצווה: ${data.testator_name}, נושא ת"ז מס' ${data.testator_id}, חתם בפנינו מרצונו הטוב והחופשי והצהיר כי זו צוואתו.\n\n`;
      content += `ולראיה באנו על החתום היום: ${data.signing_day} בחודש ${data.signing_month}, ${data.signing_year}\n\n`;
      content += `${data.witness1_name}               ${data.witness2_name}\n`;
      content += '________________               ________________\n';
      content += '   עד ראשון                        עד שני\n';
    }

    return content.trim();
  };

  const generateDocument = () => {
    const document = {
      type: 'will-individual',
      title: `צוואת ${testatorInfo.name || 'יחיד'}`,
      testatorInfo,
      heirs,
      assets,
      bankAccounts,
      executorInfo,
      specialInstructions,
      burialInstructions,
      cancelPreviousWills,
      signatures,
      generatedAt: new Date().toISOString(),
    };

    onGenerate(document);
  };

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      {/* כותרת */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          צוואת יחיד
        </h1>
        <p className="text-gray-600">
          צוואה אישית של מצווה אחד
        </p>
      </div>

      {/* פרטי מצווה */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          פרטי המצווה
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={testatorInfo.name}
              onChange={(e) => setTestatorInfo({ ...testatorInfo, name: e.target.value })}
              placeholder="שם פרטי ושם משפחה"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תעודת זהות <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={testatorInfo.idNumber}
              onChange={(e) => setTestatorInfo({ ...testatorInfo, idNumber: e.target.value })}
              placeholder="123456789"
              maxLength={9}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת מלאה
            </label>
            <input
              type="text"
              value={testatorInfo.address}
              onChange={(e) => setTestatorInfo({ ...testatorInfo, address: e.target.value })}
              placeholder="רחוב, מספר בית, עיר"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תאריך לידה
            </label>
            <input
              type="date"
              value={testatorInfo.birthDate}
              onChange={(e) => setTestatorInfo({ ...testatorInfo, birthDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>

        {/* בחירת מגדר */}
        <GenderSelector
          value={testatorInfo.gender}
          onChange={(gender) => setTestatorInfo({ ...testatorInfo, gender })}
          label="מגדר המצווה (משפיע על כל הנטיות במסמך)"
          showOrganization={false}
        />
      </section>

      {/* יורשים */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <RepeatableFieldGroup
          groupName="רשימת יורשים"
          fields={[
            { id: '1', name: 'שם_יורש', type: 'text', placeholder: 'שם מלא' },
            { id: '2', name: 'תעודת_זהות', type: 'id-number', placeholder: '123456789' },
            { id: '3', name: 'קרבה', type: 'text', placeholder: 'בן/בת/נכד/אח' },
            { id: '4', name: 'חלק_בירושה', type: 'text', placeholder: '50% או 1/3' },
          ]}
          minRows={1}
          maxRows={30}
          onChange={setHeirs}
        />
      </section>

      {/* נכסים */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
        <RepeatableFieldGroup
          groupName="רשימת נכסים"
          fields={[
            { id: '1', name: 'סוג_נכס', type: 'text', placeholder: 'דירה/מגרש/רכב/אחר' },
            { id: '2', name: 'תיאור', type: 'text', placeholder: 'כתובת או פרטים מזהים' },
            { id: '3', name: 'שווי_משוער', type: 'number', placeholder: '1000000' },
          ]}
          minRows={0}
          maxRows={50}
          onChange={setAssets}
        />
      </section>

      {/* חשבונות בנק */}
      <section className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-lg border-2 border-cyan-200">
        <RepeatableFieldGroup
          groupName="רשימת חשבונות בנק"
          fields={[
            { id: '1', name: 'שם_בנק', type: 'text', placeholder: 'בנק הפועלים' },
            { id: '2', name: 'מספר_חשבון', type: 'number', placeholder: '123456' },
            { id: '3', name: 'מספר_סניף', type: 'number', placeholder: '789' },
            { id: '4', name: 'יתרה', type: 'number', placeholder: '50000' },
          ]}
          minRows={0}
          maxRows={20}
          onChange={setBankAccounts}
        />
      </section>

      {/* מנהל עזבון */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">מנהל עזבון</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא
            </label>
            <input
              type="text"
              value={executorInfo.name}
              onChange={(e) => setExecutorInfo({ ...executorInfo, name: e.target.value })}
              placeholder="שם מנהל העזבון"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תעודת זהות
            </label>
            <input
              type="text"
              value={executorInfo.idNumber}
              onChange={(e) => setExecutorInfo({ ...executorInfo, idNumber: e.target.value })}
              placeholder="123456789"
              maxLength={9}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קרבה למצווה
            </label>
            <input
              type="text"
              value={executorInfo.relationship}
              onChange={(e) => setExecutorInfo({ ...executorInfo, relationship: e.target.value })}
              placeholder="בן/עורך דין/אחר"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>
      </section>

      {/* הוראות מיוחדות */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">הוראות מיוחדות</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הוראות כלליות
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="הוראות נוספות, משאלות, תנאים..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הוראות קבורה/לוויה
            </label>
            <textarea
              value={burialInstructions}
              onChange={(e) => setBurialInstructions(e.target.value)}
              placeholder="הוראות לגבי קבורה, לוויה, אבל..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
            />
          </div>

          <label className="flex items-center gap-3 p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={cancelPreviousWills}
              onChange={(e) => setCancelPreviousWills(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
            <div>
              <div className="font-medium text-gray-900">בטל צוואות קודמות</div>
              <div className="text-sm text-gray-600">צוואה זו מבטלת כל צוואה או הוראה קודמת</div>
            </div>
          </label>
        </div>
      </section>

      {/* בחירת סעיפים סטנדרטיים */}
      <StandardSectionsSelector
        selectedSections={selectedStandardSections}
        onSelectionChange={setSelectedStandardSections}
        documentType="will"
      />

      {/* חתימות */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <SignatureList
          signatures={signatures}
          onChange={setSignatures}
          minSignatures={1}
          maxSignatures={5}
          title="חתימות (מצווה + עדים)"
        />
        <div className="mt-3 text-sm text-gray-600">
          💡 לפחות חתימת המצווה + 2 עדים מומלץ
        </div>
      </section>

      {/* סעיפים נוספים */}
      <section className="bg-white p-6 rounded-lg border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">סעיפים נוספים</h2>
          <button
            onClick={() => setAdditionalSections(prev => [...prev, ''])}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            הוסף סעיף
          </button>
        </div>
        
        <div className="space-y-4">
          {additionalSections.map((section, index) => (
            <div key={index} className="flex gap-3">
              <div className="font-bold text-gray-600 mt-3">{index + 1}.</div>
              <div className="flex-1">
                <textarea
                  value={section}
                  onChange={(e) => {
                    const newSections = [...additionalSections];
                    newSections[index] = e.target.value;
                    setAdditionalSections(newSections);
                  }}
                  placeholder={`הזן סעיף נוסף מספר ${index + 1}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none"
                  style={{ fontSize: '13pt', fontFamily: 'David' }}
                  dir="rtl"
                  rows={3}
                />
              </div>
              <button
                onClick={() => setAdditionalSections(prev => prev.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700 mt-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* עוזר AI */}
      <section className="bg-white p-6 rounded-lg border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">🤖 עוזר AI לשיפור טקסט</h2>
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
          >
            <Sparkles className="w-4 h-4" />
            {showAI ? 'הסתר AI' : 'הצג AI'}
          </button>
        </div>
        
        {showAI && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-purple-900 mb-2">בחר טקסט לשיפור:</label>
              <select
                value={aiTextToImprove}
                onChange={(e) => setAiTextToImprove(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg"
              >
                <option value="">בחר מה לשפר...</option>
                <option value="special">הוראות מיוחדות</option>
                <option value="burial">הוראות קבורה</option>
                <option value="custom">טקסט מותאם אישית</option>
              </select>
            </div>
            
            {aiTextToImprove && (
              <SimpleAIImprover
                initialText={
                  aiTextToImprove === 'special' ? specialInstructions || 'אני רוצה שהירושה תועבר בצורה הוגנת לכל היורשים' :
                  aiTextToImprove === 'burial' ? burialInstructions || 'אני רוצה להיקבר לפי המנהג היהודי' :
                  'הזן כאן טקסט חדש לשיפור והרחבה'
                }
                onAccept={(improvedText) => {
                  if (aiTextToImprove === 'special') {
                    setSpecialInstructions(improvedText);
                  } else if (aiTextToImprove === 'burial') {
                    setBurialInstructions(improvedText);
                  }
                }}
                placeholder={`הזן ${
                  aiTextToImprove === 'special' ? 'הוראות מיוחדות' :
                  aiTextToImprove === 'burial' ? 'הוראות קבורה' :
                  'טקסט חדש'
                } לשיפור`}
              />
            )}
          </div>
        )}
      </section>

      {/* תצוגה מקדימה */}
      <section className="bg-white p-6 rounded-lg border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">👁️ תצוגה מקדימה</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'הסתר תצוגה' : 'הצג תצוגה מקדימה'}
          </button>
        </div>
        
        {showPreview && (
          <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="bg-white p-6 font-david text-right leading-7" style={{ direction: 'rtl', fontSize: '13pt' }}>
              <div className="whitespace-pre-line">
                {generateWillContent()}
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600 text-center">
              📄 תצוגה מקדימה של הצוואה המלאה עם כל הסעיפים הסטנדרטיים
            </div>
          </div>
        )}
      </section>

      {/* כפתורי יצירה וייצוא */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
        <button
          onClick={generateDocument}
          disabled={!testatorInfo.name || !testatorInfo.idNumber || heirs.length === 0}
          className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-primary transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl"
        >
          <FileText className="w-6 h-6" />
          <span>צור צוואה מלאה</span>
        </button>
        
        <SimpleExportButtons
          documentContent={generateWillContent()}
          documentTitle={`צוואת ${testatorInfo.name || 'יחיד'}`}
          className="w-full"
        />
      </div>

      {/* הנחיות */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-bold mb-2">⚠️ שים לב:</p>
        <ul className="space-y-1 mr-4">
          <li>• חובה למלא: שם + ת.ז של מצווה, ולפחות יורש אחד</li>
          <li>• מומלץ למנות מנהל עזבון</li>
          <li>• וודא שסכום אחוזי הירושה מסתכם ל-100%</li>
          <li>• הצוואה תכלול את כל הסעיפים הנדרשים על פי חוק</li>
        </ul>
      </div>
    </div>
  );
}
