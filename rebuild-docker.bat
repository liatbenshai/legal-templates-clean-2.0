@echo off
chcp 65001 >nul
echo.
echo 🔄 מעצר ומבנה מחדש את המערכת...
echo.

REM בדיקה אם Docker פועל
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker לא פועל. אנא הפעל את Docker Desktop.
    pause
    exit /b 1
)

REM זיהוי docker compose או docker-compose
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

echo 🛑 עוצר את המערכת הישנה...
%COMPOSE_CMD% down

echo 🗑️  מוחק תמונות ישנות...
docker rmi legal-templates-legal-templates >nul 2>&1

echo 🧹 מנקה cache...
docker builder prune -f >nul

echo.
echo 📦 בונה מחדש את המערכת ללא cache (זה יכול לקחת 3-5 דקות)...
echo ⏳ אנא המתן...
%COMPOSE_CMD% build --no-cache

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבנייה!
    echo 📋 בדוק את הלוגים למעלה
    pause
    exit /b 1
)

echo.
echo 🎬 מפעיל את המערכת החדשה...
%COMPOSE_CMD% up -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בהפעלה!
    pause
    exit /b 1
)

echo.
echo ⏳ ממתין לאתחול (10 שניות)...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 סטטוס המערכת:
%COMPOSE_CMD% ps

echo.
echo ✅✅✅ המערכת החדשה פועלת! ✅✅✅
echo.
echo 📱 גש ל: http://localhost:3000
echo.
echo 💡 לצפייה בלוגים: %COMPOSE_CMD% logs -f
echo.
pause

