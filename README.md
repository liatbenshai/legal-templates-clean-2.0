# מערכת תבניות משפטיות מקצועיות

מערכת מתקדמת ליצירת מסמכים משפטיים בעברית עם AI וניהול מחסן סעיפים.

## 🔧 Build Fix - useEffect imports corrected
All SendEmailDialog components now have proper useEffect imports for successful Vercel deployment.

## ✅ TypeScript Fixes Applied
- Fixed category type casting in UnifiedWarehouse.tsx
- Removed tags property from EditableSection
- All TypeScript errors resolved for successful build

## ✨ תכונות עיקריות

### 📜 צוואות
- 🏪 **מחסן סעיפים** עם 60+ סעיפים מוכנים
- 👥 **בחירת מגדר** אוטומטית למשתנים
- 🔄 **העברה בין קטגוריות** (כספי, אישי, עסקי, זוגי, ילדים, נכסים, דיגיטלי)
- ✏️ **עריכה ומחיקה** של סעיפים
- ➕ **יצירת סעיפים חדשים**
- 🤖 **AI מתקדם** עם מערכת למידה
- 🏷️ **תוויות עבריות** ידידותיות

### 📋 הנחיות מקדימות
- 🏪 **מחסן סעיפים** עם 95+ סעיפים מוכנים
- 📂 **3 קטגוריות:** רכושי, אישי, רפואי
- 👥 **בחירת מגדר** אוטומטית למשתנים
- 🔄 **העברה בין קטגוריות**
- ✏️ **עריכה ומחיקה** של סעיפים
- ➕ **יצירת סעיפים חדשים**
- 💡 **מדריך כתיבה** עם טיפים
- 🏷️ **תוויות עבריות** ידידותיות

### 💰 הסכמי שכר טרחה
- 🏪 **מחסן סעיפים** מלא
- 👥 **בחירת מגדר** אוטומטית למשתנים
- 🤖 **AI מתקדם** עם מערכת למידה
- 📝 **חלון מילוי משתנים** מתקדם
- 🏷️ **תוויות עבריות** ידידותיות

## 🚀 טכנולוגיות

- **Next.js 14** - Framework React
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **AI Integration** - Claude API (דורש ANTHROPIC_API_KEY)
- **Local Storage** - שמירת נתונים
- **Hebrew Support** - תמיכה מלאה בעברית

## 📁 מבנה הפרויקט

```
├── components/
│   ├── ProfessionalWillForm.tsx      # צוואות
│   ├── AdvanceDirectivesForm.tsx     # הנחיות מקדימות
│   ├── FeeAgreements/
│   │   └── LawyerFeeAgreement.tsx    # הסכמי שכר טרחה
│   ├── UnifiedWarehouse.tsx          # מחסן סעיפים מאוחד
│   ├── AdvancedAIImprover.tsx        # AI מתקדם
│   └── LearningSystem/               # מערכת למידה
├── lib/
│   ├── hebrew-gender.ts             # המרת מגדר עברית
│   ├── ai-legal-writer.ts           # AI כתיבה משפטית
│   └── learning-system/             # מערכת למידה
├── public/templates/
│   └── clauses/                     # מחסני סעיפים
└── types/                           # הגדרות TypeScript
```

## 🛠️ התקנה והפעלה

### שלב 1: התקנת Dependencies

```bash
npm install
```

### שלב 2: הגדרת משתני סביבה

צרי קובץ `.env.local` בתיקיית הפרויקט והוסיפי את המשתנים הבאים:

```env
# Anthropic API Key (לשיפור טקסט עם AI)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase (אם משתמשים)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**איך לקבל Anthropic API Key:**
1. היכנסי ל-[Anthropic Console](https://console.anthropic.com/)
2. צרי חשבון או התחברי
3. לךי ל-API Keys
4. צרי API key חדש
5. העתיקי את המפתח והוסיפי אותו ל-`.env.local`

**⚠️ חשוב:** 
- אל תעלי את קובץ `.env.local` ל-Git (הוא כבר ב-.gitignore)
- המפתח צריך להתחיל עם `sk-ant-` ולהכיל לפחות 20 תווים

### שלב 3: הפעלת השרת

```bash
# הפעלת שרת פיתוח
npm run dev

# בניית production
npm run build

# הפעלת production
npm start
```

השרת יעלה על `http://localhost:3000`

## 🌐 Deploy ל-Vercel

1. **צרי פרויקט חדש ב-Vercel**
2. **חברי ל-GitHub repository**
3. **הגדרי Environment Variables:**
   - לךי ל-Settings → Environment Variables
   - הוסיפי את המשתנים הבאים:
     - `ANTHROPIC_API_KEY` - המפתח שלך מ-Anthropic
     - `NEXT_PUBLIC_SUPABASE_URL` - אם משתמשים ב-Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - אם משתמשים ב-Supabase
4. **Deploy** - הפרויקט יעלה אוטומטית!

**⚠️ חשוב:** ללא `ANTHROPIC_API_KEY`, תכונת שיפור הטקסט עם AI לא תעבוד (תקבלי שגיאת 401).

## 📝 רישיון

© 2024 - מערכת תבניות משפטיות מקצועיות

--- 

**💡 הערה:** המערכת מוכנה לייצור וכל התכונות עובדות בצורה מושלמת!
