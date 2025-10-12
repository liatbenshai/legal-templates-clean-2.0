# 🔐 הגדרת API Key ב-Vercel

## 🎯 מטרה
להגדיר את ה-API key של Claude (או AI אחר) כך שיהיה **קבוע ומאובטח**.

---

## 📋 צעדים

### שלב 1: קבל API Key

אם אין לך עדיין:

**Claude (Anthropic):**
1. לך ל-https://console.anthropic.com
2. צור חשבון
3. לך ל-API Keys
4. צור key חדש
5. העתק את ה-key (מתחיל ב-`sk-ant-`)

**OpenAI (ChatGPT) - אופציה חלופית:**
1. לך ל-https://platform.openai.com
2. צור חשבון
3. לך ל-API Keys
4. צור key חדש
5. העתק את ה-key (מתחיל ב-`sk-`)

---

### שלב 2: הוסף את ה-Key ב-Vercel

#### דרך 1: דרך ה-Dashboard (מומלץ)

1. **לך ל-Vercel Dashboard:**
   https://vercel.com/dashboard

2. **בחר את הפרויקט:**
   `legal-templates-clean`

3. **לחץ Settings:**
   (בתפריט העליון)

4. **לחץ Environment Variables:**
   (בתפריט הצדדי)

5. **הוסף משתנה חדש:**
   - **Name:** `CLAUDE_API_KEY`
   - **Value:** הדבק את ה-API key שלך
   - **Environments:** סמן את כל האופציות (Production, Preview, Development)
   - לחץ **Save**

6. **חזור על זה עבור כל API שאת רוצה:**
   - `OPENAI_API_KEY` (אופציונלי)
   - `GEMINI_API_KEY` (אופציונלי)

#### דרך 2: דרך ה-CLI (מהירה יותר)

```cmd
# הוסף Claude API Key
vercel env add CLAUDE_API_KEY

# הסקריפט ישאל:
# 1. What's the value? → הדבק את ה-key
# 2. Add to which environments? → לחץ Space על כולם, אחר כך Enter

# אופציונלי - הוסף גם OpenAI
vercel env add OPENAI_API_KEY
```

---

### שלב 3: עדכן את הפרויקט

אחרי שהוספת את המשתנים:

```cmd
vercel --prod
```

זה יעלה מחדש את המערכת עם המשתנים החדשים.

---

## ✅ איך לבדוק שזה עובד?

### בדיקה מהירה:

1. **גלוש למערכת:**
   https://legal-templates-clean-r363x86rp.vercel.app

2. **לך לדף בדיקת AI:**
   https://legal-templates-clean-r363x86rp.vercel.app/ai-test

3. **נסה לשפר טקסט**
   - אם זה עובד ללא הזנת API key → הצלחנו! ✅
   - אם זה מבקש API key → צריך לבדוק את ההגדרות

---

## 🔒 אבטחה

### למה משתמשים במשתני סביבה?

- ✅ **מאובטח** - ה-key לא נשמר בקוד
- ✅ **קבוע** - לא צריך להזין כל פעם
- ✅ **גיבוי** - אם נמחק מ-localStorage, יש גיבוי
- ✅ **פרודקשן** - הדרך המקצועית

### ⚠️ חשוב!

**לעולם אל תשמרי API keys בקוד או ב-Git!**

שמור אותם ב:
- ✅ Vercel Environment Variables
- ✅ או ב-localStorage (בדפדפן בלבד)

---

## 📊 סדר עדיפויות

המערכת תחפש API key בסדר הזה:

1. **משתני סביבה** (Vercel) - **מומלץ לפרודקשן!**
2. **localStorage** (דפדפן) - לפיתוח מקומי

---

## 🆘 פתרון בעיות

### בעיה: "API key לא עובד"

**בדוק:**
1. שה-key נכון (מתחיל ב-`sk-ant-` לClaude)
2. שהוא הוזן ב-Vercel נכון
3. שהעלית מחדש: `vercel --prod`

### בעיה: "אין quota"

**פתרון:**
- בדוק את המכסה ב-console של Claude/OpenAI
- יתכן שצריך להוסיף כרטיס אשראי (אבל יש free tier)

### בעיה: "המערכת לא רואה את ה-key"

**פתרון:**
1. וודא שהשם של המשתנה **בדיוק** `CLAUDE_API_KEY`
2. בדוק שסומן "Production" בסביבות
3. העלה מחדש: `vercel --prod`

---

## 💡 טיפ חשוב

### שמור גיבוי של ה-Keys!

צור קובץ טקסט פרטי (לא בפרויקט!) ושמור בו:

```
Claude API Key: sk-ant-xxxxx...
OpenAI API Key: sk-xxxxx...
תאריך יצירה: 9.10.2025
```

**שמור אותו במקום בטוח!**

---

## 🎯 סיכום מהיר

### מה צריך לעשות עכשיו:

```cmd
# 1. הוסף את ה-API key ב-Vercel
vercel env add CLAUDE_API_KEY

# 2. הזן את ה-key כשמתבקש

# 3. העלה מחדש
vercel --prod

# זהו! 🎉
```

---

## 📞 צריך עזרה?

ספרי לי:
1. איזה API key יש לך? (Claude/OpenAI/Gemini)
2. מה השגיאה שאת מקבלת?

ואני אעזור! 💙

