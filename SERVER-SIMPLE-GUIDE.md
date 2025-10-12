# 📖 מדריך פשוט להעלאה לשרת - ללא Git!

## ⚠️ דברים חשובים לדעת תחילה

### האם השרת שלך תומך ב-Node.js?

המערכת הזו צריכה **Node.js 18 ומעלה**.

#### איך לבדוק?

**אופציה 1: שאל את חברת האחסון**
- שלח להם מייל: "האם השרת שלי תומך ב-Node.js 18?"
- אם כן - מצוין! המשך במדריך
- אם לא - תצטרך Vercel (ראה למטה)

**אופציה 2: בדוק ב-cPanel**
- היכנס ל-cPanel
- חפש "Node.js" או "Node.js Selector"
- אם יש - הוא תומך!
- אם אין - לא תומך

---

## ✅ אם השרת שלך **תומך** ב-Node.js

### צעד 1: הכן את הקבצים (במחשב שלך)

```cmd
prepare-for-server.bat
```

זה ייצור תיקייה בשם `server-upload` עם כל מה שצריך.

### צעד 2: דחוס לקובץ ZIP

1. לחץ ימני על התיקייה `server-upload`
2. בחר "שלח אל" → "Compressed (zipped) folder"
3. קרא לקובץ: `legal-templates.zip`

### צעד 3: העלה את ה-ZIP לשרת

#### דרך cPanel File Manager:

1. **היכנס ל-cPanel**
   - `https://your-domain.co.il:2083`

2. **פתח File Manager**

3. **עבור לתיקייה הנכונה**
   - לא `public_html`!
   - תיקייה מחוץ ל-public
   - למשל: `/home/username/apps/` או `/home/username/`

4. **העלה את ה-ZIP**
   - לחץ "Upload"
   - בחר את `legal-templates.zip`
   - חכה שיסתיים

5. **חלץ את הקבצים**
   - לחץ ימני על `legal-templates.zip`
   - בחר "Extract"
   - אישור

### צעד 4: התקן והרץ (SSH)

**צריך גישת SSH!** אם אין לך - עבור ל"אם אין SSH" למטה.

```bash
# 1. התחבר ב-SSH (PuTTY בWindows)
ssh username@your-domain.co.il

# 2. עבור לתיקייה
cd server-upload

# 3. התקן תלויות
npm install --production

# 4. הרץ את השרת
npm start
```

השרת ירוץ על פורט 3000.

### צעד 5: הגדר Reverse Proxy (חובה!)

**ב-cPanel:**
1. לך ל-"Application Manager" או "Setup Node.js App"
2. צור אפליקציה חדשה:
   - Application Root: התיקייה שיצרת
   - Application URL: `your-domain.co.il`
   - Application Startup File: `server.js`
   - Port: 3000

3. לחץ "Create"

---

## ❌ אם השרת שלך **לא תומך** ב-Node.js

### אין ברירה - צריך Vercel!

**אבל אל תדאגי! זה פשוט יותר משנראה!**

---

## 🎯 הדרך הכי פשוטה: Vercel (ללא Git!)

### אפשר להעלות ל-Vercel **בלי Git!** דרך Vercel CLI!

#### צעד 1: התקן Vercel CLI

```cmd
npm install -g vercel
```

#### צעד 2: התחבר

```cmd
vercel login
```

זה יפתח דפדפן - פשוט תתחבר עם אימייל.

#### צעד 3: העלה!

```cmd
vercel
```

זהו! הסקריפט ישאל כמה שאלות פשוטות:
- "Set up and deploy?" → Enter (כן)
- "Which scope?" → Enter
- "Link to existing project?" → N (לא)
- "What's your project's name?" → legal-templates
- "In which directory is your code located?" → Enter (.)

**תוך 2 דקות תקבלי לינק!**

#### צעד 4: חבר את הדומיין שלך

```cmd
vercel domains add your-domain.co.il
```

עקוב אחרי ההוראות.

---

## 📋 השוואה מהירה

| דרך | קלה? | חינם? | צריך SSH? | זמן |
|-----|------|-------|------------|-----|
| **Vercel CLI** | ✅✅✅ מאוד | ✅ כן | ❌ לא | 5 דק' |
| **שרת עם Node.js** | ⚠️ בינוני | ⚠️ תלוי | ✅ כן | 30 דק' |
| **Shared Hosting** | ❌ לא עובד | - | - | - |

---

## 🆘 עזרה מהירה

### אם אתה לא בטוחה מה יש לך:

1. **שאלות לשאול את חברת האחסון:**
   - "האם יש תמיכה ב-Node.js 18?"
   - "האם יש גישת SSH?"
   - "האם יש Application Manager ב-cPanel?"

2. **אם התשובות 'לא':**
   → **לך עם Vercel CLI!** (האופציה הכי פשוטה)

3. **אם התשובות 'כן':**
   → אפשר להשתמש בשרת שלך (אבל Vercel עדיין קל יותר)

---

## 🎯 ההמלצה הסופית שלי

### עבור עם Vercel CLI - בלי Git!

**למה?**
- ✅ לא צריך ללמוד Git
- ✅ פשוט כמו להעלות קובץ
- ✅ חינם לגמרי
- ✅ עובד עם הדומיין שלך
- ✅ 5 דקות והכל מוכן!

### הצעדים (פשוט מאוד!):

```cmd
REM 1. התקן את Vercel
npm install -g vercel

REM 2. התחבר (יפתח דפדפן)
vercel login

REM 3. העלה (בתיקיית הפרויקט)
vercel

REM 4. חבר דומיין (אופציונלי)
vercel domains add your-domain.co.il
```

**זהו! 🎉**

---

## 💬 שאלות נוספות?

### "אין לי SSH, אין לי Node.js בשרת"
→ **Vercel CLI זה הפתרון היחיד והטוב ביותר!**

### "אני לא מצליחה עם npm install"
→ **נסה:**
```cmd
npm cache clean --force
npm install
```

### "Vercel לא עובד"
→ **שלח לי את השגיאה שאת מקבלת**

---

## 📞 רוצה עזרה נוספת?

אני כאן! רק ספרי לי:
1. איזה סוג שרת יש לך? (שם חברת האחסון)
2. האם יש Node.js?
3. האם יש SSH?

ואני אכין לך מדריך מותאם אישית! 💙

