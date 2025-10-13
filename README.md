# Legal Templates - תבניות משפטיות

פלטפורמה לשיפור טקסטים משפטיים שנוצרו על ידי AI ולניהול תבניות משפטיות בעברית .

## תיאור הפרויקט

המטרה המרכזית של הפלטפורמה היא לשפר טקסטים משפטיים שנוצרו על ידי AI (Claude, ChatGPT, Gemini) ולהפוך אותם לעברית משפטית אמיתית, תקנית ומקצועית כפי שנכתבת בפועל במסמכים משפטיים ישראליים.

## טכנולוגיות

- **Next.js 14.2.5** - React framework
- **TypeScript** - טיפוסים סטטיים
- **Tailwind CSS** - עיצוב ו-UI
- **Lucide React** - אייקונים

## התקנה

```bash
# התקן תלויות
npm install

# הרץ בסביבת פיתוח
npm run dev

# בנה לפרודקשן
npm run build

# הרץ בפרודקשן
npm start
```

## מבנה הפרויקט

```
legal-templates/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout ראשי
│   ├── page.tsx           # דף הבית
│   ├── globals.css        # סגנונות גלובליים
│   ├── templates/         # דפי תבניות
│   │   ├── page.tsx       # רשימת תבניות
│   │   └── [id]/          # תבנית בודדת
│   │       └── page.tsx
│   └── editor/            # עורך טקסטים
│       └── page.tsx
├── components/            # רכיבי UI
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── TemplateCard.tsx
│   ├── TemplateSearch.tsx
│   └── TemplateEditor.tsx
├── lib/                   # לוגיקה עסקית
│   ├── types.ts          # טיפוסים בסיסיים
│   ├── templates.ts      # ניהול תבניות
│   ├── editor-types.ts   # טיפוסים לעורך
│   ├── document-templates.ts  # תבניות מסמכים מובנים
│   └── document-renderer.ts   # רנדור מסמכים
├── public/               # קבצים סטטיים
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── postcss.config.js
```

## תכונות עיקריות

### 1. תבניות משפטיות
- כתבי בית דין
- צוואות
- ייפויי כוח
- הסכמים
- בקשות לבית משפט
- ערעורים
- דיני משפחה
- נדל"ן
- דיני חברות

### 2. עורך טקסטים
- שיפור טקסטים משפטיים מ-AI
- המרה לעברית משפטית תקנית
- עריכה ועיצוב מסמכים

### 3. מערכת שדות דינמית
- שדות מותאמים אישית
- ולידציות מתקדמות
- תמיכה בסוגי שדות מגוונים

### 4. ייצוא מסמכים
- HTML
- PDF (בעתיד)
- DOCX (בעתיד)

## סקריפטים

```bash
npm run dev      # הרצה בפיתוח
npm run build    # בניית הפרויקט
npm run start    # הרצה בפרודקשן
npm run lint     # הרצת linter
```

## 🐳 Docker

הפרויקט מוכן להרצה ב-Docker עם הגדרת `output: 'standalone'` ב-`next.config.js`.

### הרצה מהירה:

**Windows:**
```cmd
docker-start.bat
```

**Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

### הרצה ידנית:

```bash
# בניית והרצת המערכת
docker compose build
docker compose up -d

# צפייה בלוגים
docker compose logs -f

# עצירה
docker compose down
```

האפליקציה תהיה זמינה ב: **http://localhost:3000**

📖 **למדריך מפורט ראה:** [DOCKER-GUIDE.md](./DOCKER-GUIDE.md)

## רישיון

כל הזכויות שמורות © 2024

