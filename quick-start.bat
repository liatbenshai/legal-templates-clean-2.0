@echo off
chcp 65001 >nul
echo.
echo 🚀 הפעלה מהירה של המערכת ב-Docker
echo.

REM בדיקה אם Docker פועל
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker לא פועל. אנא הפעל את Docker Desktop והרץ שוב.
    pause
    exit /b 1
)

echo ✅ Docker פועל
echo.

REM זיהוי docker compose
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

echo 🛑 עוצר מערכת ישנה אם קיימת...
%COMPOSE_CMD% down >nul 2>&1

echo.
echo 🗑️  מוחק תמונה ישנה...
docker rmi legal-templates-legal-templates >nul 2>&1

echo.
echo 📦 בונה את המערכת מחדש (2-5 דקות)...
%COMPOSE_CMD% build --no-cache

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבנייה!
    echo.
    echo 📋 מנסה שוב עם פלט מפורט...
    %COMPOSE_CMD% build
    pause
    exit /b 1
)

echo.
echo ✅ הבנייה הושלמה!
echo.
echo 🎬 מפעיל את המערכת...
%COMPOSE_CMD% up -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בהפעלה!
    echo.
    echo 📋 לוגים:
    %COMPOSE_CMD% logs
    pause
    exit /b 1
)

echo.
echo ⏳ ממתין לאתחול (10 שניות)...
timeout /t 10 /nobreak >nul

echo.
echo 📊 סטטוס הקונטיינרים:
%COMPOSE_CMD% ps

echo.
echo 📋 לוגים אחרונים:
%COMPOSE_CMD% logs --tail=30 legal-templates

echo.
echo ✅✅✅ המערכת פועלת בהצלחה! ✅✅✅
echo.
echo 🌐 פותח דפדפן...
echo    http://localhost:3000
echo.
echo 💡 פקודות שימושיות:
echo    docker compose logs -f        - צפייה בלוגים
echo    docker compose restart        - הפעלה מחדש
echo    docker compose down           - עצירה
echo.
start http://localhost:3000
pause

