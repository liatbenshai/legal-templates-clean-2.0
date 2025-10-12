# 📤 מדריך העלאה לשרת משלך

## 🎯 למי זה מתאים?
- יש לך דומיין ושרת משלך (Shared Hosting / VPS)
- יש לך גישה ל-cPanel / Plesk / FTP
- אתה רוצה מערכת עצמאית לחלוטין ללא תלות חיצונית

---

## ⚡ תהליך מהיר - 3 שלבים

### שלב 1: בנה את המערכת 🏗️

הרץ את הסקריפט:

```cmd
build-for-upload.bat
```

זה ייצור תיקייה בשם `upload-ready` עם כל הקבצים.

### שלב 2: העלה לשרת 📤

#### אופציה א': דרך cPanel File Manager

1. **התחבר ל-cPanel**
   - כנס לכתובת: `https://your-domain.co.il:2083`
   - או `https://your-domain.co.il/cpanel`

2. **פתח File Manager**
   - לחץ על "File Manager" באייקונים

3. **נווט לתיקיית האתר**
   - לחץ על `public_html` (או `www` / `httpdocs`)
   - **מחק את כל התוכן הישן** (אם יש)

4. **העלה קבצים**
   - לחץ "Upload" בפינה העליונה
   - גרור את **כל התוכן** מתיקיית `upload-ready`
   - חכה שהכל יועלה (זה יכול לקחת 5-10 דקות)

5. **וודא העלאה**
   - בדוק שיש קובץ `.htaccess` (עשוי להיות מוסתר)
   - אם לא רואה אותו, לחץ "Settings" ובחר "Show Hidden Files"

#### אופציה ב': דרך FTP (FileZilla)

1. **התקן FileZilla**
   - הורד מ-https://filezilla-project.org

2. **התחבר לשרת**
   - Host: `ftp.your-domain.co.il`
   - Username: שם המשתמש שקיבלת
   - Password: הסיסמה שלך
   - Port: 21
   - לחץ "Quickconnect"

3. **נווט לתיקייה הנכונה**
   - בחלון הימני: מצא `public_html` (או `www`)
   - **מחק את כל התוכן הישן**

4. **העלה קבצים**
   - בחלון השמאלי: פתח את תיקיית `upload-ready`
   - סמן הכל (Ctrl+A)
   - גרור לחלון הימני
   - חכה שהכל יועלה

### שלב 3: בדוק שזה עובד ✅

1. **גלוש לאתר**
   - פתח: `https://your-domain.co.il`

2. **בדוק דפים**
   - דף הבית
   - יצירת מסמכים
   - ניהול סעיפים

3. **בדוק שגיאות**
   - פתח Console (F12)
   - ודא שאין שגיאות אדומות

---

## 🔧 פתרון בעיות

### בעיה: "404 Not Found" בניווט

**פתרון:** וודא שקובץ `.htaccess` הועלה:

```bash
# ב-cPanel File Manager:
1. לחץ Settings (למעלה מימין)
2. סמן "Show Hidden Files (dotfiles)"
3. לחץ Save
4. בדוק שיש .htaccess בתיקייה
```

אם אין, העלה אותו ידנית:
- בחר את הקובץ `.htaccess` מתיקיית הפרויקט
- העלה אותו ל-`public_html`

### בעיה: הדף נראה שבור (ללא עיצוב)

**סיבה:** הקבצים לא הועלו במבנה נכון.

**פתרון:**
1. וודא שהעלת **את כל התוכן מתוך** `upload-ready`
2. **לא** את תיקיית `upload-ready` עצמה
3. המבנה צריך להיות:
   ```
   public_html/
   ├── index.html
   ├── _next/
   ├── documents/
   ├── sections/
   └── .htaccess
   ```

### בעיה: "500 Internal Server Error"

**סיבה:** בעיה בקובץ `.htaccess`

**פתרון:**
1. שנה את שם הקובץ `.htaccess` ל-`.htaccess.bak`
2. רענן את האתר
3. אם זה עובד, יש בעיה עם אחת ההנחיות
4. מחק את כל ההנחיות מ-`.htaccess` והשאר רק את rewrite rules

### בעיה: האתר איטי

**פתרון:**
1. **הפעל Gzip Compression** ב-cPanel:
   - cPanel → Software → Optimize Website
   - בחר "Compress All Content"

2. **הפעל Browser Caching** (`.htaccess` כבר מכיל את זה)

3. **אם יש Cloudflare**, הפעל אותו:
   - הירשם ל-https://cloudflare.com (חינם)
   - הוסף את הדומיין שלך
   - עקוב אחרי ההוראות לשינוי nameservers

---

## 🔒 הגדרות אבטחה מומלצות

### 1. אכיפת HTTPS

ב-cPanel:
1. לך ל-"SSL/TLS Status"
2. לחץ "Run AutoSSL"
3. חכה שהתעודה תותקן

### 2. הגנה על תיקיות

הוסף קובץ `.htaccess` לתיקיות רגישות:

```apache
# .htaccess בתיקיות שלא צריכות גישה ישירה
Order deny,allow
Deny from all
```

### 3. גיבויים

הגדר גיבויים אוטומטיים ב-cPanel:
1. לך ל-"Backup Wizard"
2. בחר "Full Backup"
3. הגדר תזמון

---

## 📊 דרישות שרת מינימליות

- **PHP:** לא נדרש! (זה Next.js סטטי)
- **Apache/Nginx:** כן (רוב השרתים)
- **שטח אחסון:** ~50MB
- **Bandwidth:** תלוי בכמות הגולשים

---

## 🔄 עדכון המערכת

כשעושים שינויים:

1. **בפרויקט המקומי:**
   ```cmd
   build-for-upload.bat
   ```

2. **העלה מחדש:**
   - מחק את התוכן ב-`public_html`
   - העלה את התוכן החדש מ-`upload-ready`

3. **נקה Cache:**
   - Ctrl+Shift+R בדפדפן
   - או נקה cache ב-Cloudflare (אם משתמש)

---

## 📝 רשימת קבצים שצריכים להיות בשרת

```
public_html/
├── .htaccess              ✅ חובה!
├── index.html             ✅ דף הבית
├── 404.html              ✅ דף שגיאה
├── _next/                ✅ קבצי Next.js
│   ├── static/
│   └── ...
├── documents/            ✅ דפי מסמכים
│   ├── will/
│   ├── court-petition/
│   └── ...
├── sections/             ✅ ניהול סעיפים
│   └── manage/
└── favicon.ico           ✅ אייקון

סה"כ: בערך 400-600 קבצים
```

---

## 💰 עלויות

### אחסון משותף (Shared Hosting):
- **בארץ:** 20-50 ₪/חודש
  - GoDaddy Israel
  - Hostinger
  - Bluehost

- **בחו"ל:** $3-10/חודש
  - Hostinger
  - Namecheap
  - A2 Hosting

**מה כלול:**
- ✅ דומיין חינם (שנה ראשונה)
- ✅ SSL חינם
- ✅ cPanel
- ✅ אימייל
- ✅ די בשפע למערכת שלך!

---

## 🆘 צריך עזרה?

### תמיכה טכנית:
1. **מדריכי cPanel:** https://docs.cpanel.net
2. **פורומי WordPress:** (עובד גם ל-Next.js סטטי)
3. **תמיכת החברה המארחת** שלך

### בעיות נפוצות:
- "הקבצים לא נראים" → הפעל "Show Hidden Files"
- "השרת לא תומך ב-rewrite" → דבר עם התמיכה
- "האתר איטי" → הוסף Cloudflare

---

## ✅ צ'קליסט סופי

לפני ש"הולכים לייב":

- [ ] build-for-upload.bat הורץ בהצלחה
- [ ] כל הקבצים מ-upload-ready הועלו
- [ ] קובץ .htaccess קיים בשרת
- [ ] HTTPS עובד (מנעול ירוק)
- [ ] כל הדפים נטענים
- [ ] אין שגיאות בקונסול
- [ ] המערכת עובדת במובייל
- [ ] הגדרת גיבוי אוטומטי

---

## 🎉 סיימת!

המערכת שלך עכשיו חיה ב:
**https://your-domain.co.il**

**עצמאית לחלוטין. ללא תלויות חיצוניות. 100% שלך! 🚀**

---

## 📞 שאלות נוספות?

1. בדוק את המדריכים האחרים:
   - `DEPLOYMENT-GUIDE.md` - הסברים כלליים
   - `QUICK-DEPLOY.md` - מדריך מהיר

2. חפש בפורומים:
   - Stack Overflow
   - Reddit r/webdev

3. פנה לתמיכה של חברת האחסון שלך

