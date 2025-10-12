@echo off
chcp 65001 >nul
echo.
echo 🚀 מתחיל להריץ את מערכת התבניות המשפטיות ב-Docker...
echo.

REM בדיקה אם Docker פועל
echo 🔍 בודק אם Docker פועל...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Docker לא פועל!
    echo 📖 אנא:
    echo    1. פתח את Docker Desktop
    echo    2. חכה עד שהסטטוס יהיה "Running"
    echo    3. הרץ את הסקריפט הזה שוב
    echo.
    pause
    exit /b 1
)

echo ✅ Docker פועל
echo.

REM בדיקה אם docker compose זמין
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  docker compose לא נמצא, מנסה docker-compose...
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

REM ניקוי containers ישנים
echo 🧹 מנקה containers ישנים...
%COMPOSE_CMD% down >nul 2>&1

echo.
echo 📦 בונה את התמונה... (זה יכול לקחת 2-5 דקות בפעם הראשונה)
echo ⏳ אנא המתן...
%COMPOSE_CMD% build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבניית התמונה!
    echo.
    echo 🔧 פתרונות אפשריים:
    echo    1. בדוק שיש מספיק מקום פנוי על הדיסק
    echo    2. נסה: docker system prune -a
    echo    3. הפעל מחדש את Docker Desktop
    echo    4. ראה לוגים למעלה לפרטים
    echo.
    pause
    exit /b 1
)

echo ✅ הבנייה הושלמה בהצלחה
echo.
echo 🎬 מפעיל את האפליקציה...
%COMPOSE_CMD% up -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בהפעלת האפליקציה!
    echo.
    echo 🔍 בדיקת סטטוס:
    %COMPOSE_CMD% ps
    echo.
    echo 📋 לוגים אחרונים:
    %COMPOSE_CMD% logs --tail=50
    echo.
    pause
    exit /b 1
)

echo ✅ האפליקציה עלתה בהצלחה!
echo.
echo ⏳ ממתין לאתחול המערכת (10 שניות)...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 בודק סטטוס:
%COMPOSE_CMD% ps
echo.

echo ✅✅✅ המערכת פועלת בהצלחה! ✅✅✅
echo.
echo 📱 גש לכתובת: http://localhost:3000
echo.
echo 📋 פקודות שימושיות:
echo    %COMPOSE_CMD% logs -f              - צפייה בלוגים בזמן אמת
echo    %COMPOSE_CMD% ps                   - בדיקת סטטוס
echo    %COMPOSE_CMD% stop                 - עצירת האפליקציה
echo    %COMPOSE_CMD% down                 - עצירה ומחיקת containers
echo    %COMPOSE_CMD% restart              - הפעלה מחדש
echo    docker-stop.bat                    - סקריפט עצירה
echo.
echo 💡 טיפ: אם יש בעיה, הרץ: %COMPOSE_CMD% logs -f
echo.
pause

