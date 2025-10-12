# 🚀 מדריך מהיר ל-Deploy

## הבעיה
Vercel CLI לא עובד עם שם משתמש בעברית.

## הפתרון הקל ביותר

### שלב 1: בדקי אם יש GitHub מחובר
1. כנסי ל: https://vercel.com/dashboard
2. פתחי את **legal-templates-clean**
3. לכי ל: **Settings** → **Git**

### אם יש GitHub:
```bash
git add .
git commit -m "Fix: Load custom sections in will editor"
git push
```
(Vercel יעשה auto-deploy)

### אם אין GitHub:
לחצי על: **Settings** → **Git** → **Connect Git Repository**

---

## פתרון זמני (עד ה-Deploy)

היכנסי לאתר החי ורצי את הקוד הזה בקונסול:

```javascript
// העבר סעיפים ישנים למפתח החדש
const oldKey = 'customWillSections';
const newKey = 'customSections_wills';

const oldData = localStorage.getItem(oldKey);
if (oldData) {
  localStorage.setItem(newKey, oldData);
  localStorage.removeItem(oldKey);
  console.log('✅ הסעיפים הועברו!');
  location.reload();
} else {
  console.log('ℹ️ אין סעיפים ישנים');
}
```

זה יתקן את הבעיה מיידית באתר החי!

---

## אם שום דבר לא עובד

אפשר לעשות Manual Redeploy:
1. Vercel Dashboard → **legal-templates-clean**
2. **Deployments** tab
3. בחר את הפריסה האחרונה
4. לחץ על **"..."** → **"Redeploy"**

זה יפרוס מחדש את הקוד הקיים (אבל ללא התיקונים).

