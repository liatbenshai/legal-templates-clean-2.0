# ⚡ חיבור GitHub - פשוט ומהיר!

## צעד 1: יצירת Repository ב-GitHub (2 דקות)

1. **פתחי לינק חדש:**
   👉 https://github.com/new

2. **מלאי את הפרטים:**
   - **Repository name:** `legal-templates-clean`
   - **Description:** (אופציונלי) "מערכת תבניות משפטיות"
   - **סמני:** ✅ Private (כדי שזה יישאר פרטי)
   - **אל תסמני:** ❌ Add README, .gitignore, או license
   
3. **לחצי:** "Create repository"

4. **GitHub יראה לך מסך עם פקודות** - תשאירי אותו פתוח!

---

## צעד 2: חיבור הפרויקט (דקה אחת)

**העתיקי את ה-URL** שGitHub נתן לך (משהו כמו):
```
https://github.com/YOUR-USERNAME/legal-templates-clean.git
```

---

## צעד 3: הרצת הפקודות (30 שניות)

1. **פתחי PowerShell** בתיקיית הפרויקט:
   - Right Click על התיקייה
   - "Open in Terminal" או "Open PowerShell here"

2. **העתיקי והדביקי את הפקודות האלה אחת אחרי השנייה:**

```bash
git init
git add .
git commit -m "Initial commit with sections warehouse fixes"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/legal-templates-clean.git
git push -u origin main
```

**החליפי `YOUR-USERNAME` בשם המשתמש שלך ב-GitHub!**

---

## צעד 4: חיבור Vercel ל-GitHub (דקה אחת)

1. **חזרי ל-Vercel:**
   👉 https://vercel.com/legal-templates-clean/settings/git

2. **לחצי על:** "Connect Git Repository"

3. **בחרי:** GitHub

4. **תני הרשאות** (אם מבקש)

5. **בחרי:** `legal-templates-clean`

6. **לחצי:** "Connect"

---

## 🎉 זהו! סיימת!

מעכשיו, כל פעם שתרצי לעדכן:
```bash
git add .
git commit -m "תיאור השינוי"
git push
```

ו-Vercel יעשה deploy אוטומטית! ⚡

---

## ❓ בעיות?

אם משהו לא עובד - תגידי לי בדיוק איפה נתקעת ואני אעזור!

