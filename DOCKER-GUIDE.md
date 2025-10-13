# 🐳 מדריך הרצת המערכת ב-Docker

## ✅ דרישות מקדימות

1. התקנת Docker Desktop:
   - הורד מ: https://www.docker.com/products/docker-desktop
   - ודא ש-Docker Desktop פועל (אייקון הלווי יהיה פעיל)

2. ודא שיש לך מספיק מקום פנוי על הדיסק (לפחות 2GB)

## 🚀 הרצת המערכת - אפשרות 1 (מומלץ)

### Windows:
```cmd
docker-start.bat
```

### Linux/Mac:
```bash
chmod +x docker-start.sh
./docker-start.sh
```

## 🚀 הרצת המערכת - אפשרות 2 (ידנית)

### 1. בדיקה ש-Docker פועל:
```bash
docker --version
docker compose version
```

### 2. בניית והרצת המערכת:
```bash
# בניית התמונה
docker compose build

# הרצת המערכת ברקע
docker compose up -d

# צפייה בלוגים
docker compose logs -f
```

### 3. פתיחת הדפדפן:
```
http://localhost:3000
```

## 📊 פקודות ניהול שימושיות

### בדיקת סטטוס:
```bash
docker compose ps
```

### צפייה בלוגים:
```bash
# כל הלוגים
docker compose logs

# לוגים בזמן אמת
docker compose logs -f

# 100 שורות אחרונות
docker compose logs --tail=100
```

### עצירת המערכת:
```bash
# עצירה זמנית
docker compose stop

# עצירה והסרה
docker compose down
```

### הפעלה מחדש:
```bash
# הפעלה מחדש של הכל
docker compose restart

# הפעלה מחדש של שירות ספציפי
docker compose restart legal-templates
```

### ניקוי מלא:
```bash
# הסרת כל הקונטיינרים, התמונות והנתונים
docker compose down --volumes --rmi all
```

## 🔧 פתרון בעיות נפוצות

### הבעיה: "Docker לא פועל"
**פתרון:** 
- פתח את Docker Desktop
- חכה עד שהסטטוס יהיה "Running"
- נסה שוב

### הבעיה: "port 3000 is already in use"
**פתרון 1 - עצור את התהליך שתופס את הפורט:**
```bash
# Windows (PowerShell):
netstat -ano | findstr :3000
taskkill /PID <מספר_התהליך> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill
```

**פתרון 2 - שנה את הפורט ב-docker-compose.yml:**
```yaml
ports:
  - "3001:3000"  # במקום 3000:3000
```

### הבעיה: "Error response from daemon: Get... unauthorized"
**פתרון:**
```bash
docker login
```

### הבעיה: המערכת לא עולה
**צעדים לאבחון:**

1. בדוק לוגים:
```bash
docker compose logs legal-templates
```

2. בדוק אם הקונטיינר רץ:
```bash
docker compose ps
```

3. היכנס לקונטיינר לבדיקה:
```bash
docker compose exec legal-templates sh
ls -la
cat package.json
```

4. בנה מחדש ללא cache:
```bash
docker compose build --no-cache
docker compose up -d
```

## 🌐 הרצה עם Nginx (אופציונלי)

אם אתה רוצה להריץ עם Nginx כ-reverse proxy:

```bash
docker compose --profile with-nginx up -d
```

אז המערכת תהיה זמינה גם ב:
- http://localhost (פורט 80)
- http://localhost:3000 (ישיר)

## 📦 עדכון המערכת

כאשר אתה משנה קוד:

```bash
# עצור את המערכת
docker compose down

# בנה מחדש
docker compose build

# הרץ שוב
docker compose up -d
```

## 🔐 משתני סביבה

אם יש צורך במשתני סביבה, צור קובץ `.env` בתיקיית הפרויקט:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000
# הוסף משתנים נוספים לפי הצורך
```

## 💡 טיפים

1. **פיתוח מקומי**: להרצה מקומית בלי Docker השתמש ב:
   ```bash
   npm run dev
   ```

2. **ביצועים**: אם הבנייה איטית, ודא ש:
   - Docker Desktop מוגדר לשימוש במספיק RAM (לפחות 4GB)
   - WSL2 מופעל (Windows)

3. **עדכונים**: לעדכון Docker Desktop בדוק עדכונים דרך האפליקציה

## 📞 תמיכה נוספת

אם אתה נתקל בבעיה:
1. בדוק את הלוגים: `docker compose logs -f`
2. בדוק את סטטוס הקונטיינרים: `docker compose ps`
3. נסה לבנות מחדש ללא cache: `docker compose build --no-cache`

