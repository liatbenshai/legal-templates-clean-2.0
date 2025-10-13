@echo off
chcp 65001 >nul
echo.
echo 🔍 בונה ובודק את המערכת בצורה מפורטת...
echo.

REM זיהוי docker compose או docker-compose
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

echo 🛑 עוצר מערכת ישנה...
%COMPOSE_CMD% down

echo.
echo 📦 בונה עם פלט מלא (זה יקח כמה דקות)...
echo ================================================
%COMPOSE_CMD% build --no-cache --progress=plain

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌❌❌ הבנייה נכשלה! ❌❌❌
    echo.
    echo 📸 צלמי מסך של השגיאה למעלה ושלחי לי!
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo ✅ הבנייה הצליחה!
echo.

echo 🎬 מפעיל...
%COMPOSE_CMD% up -d

echo.
echo ⏳ ממתין 5 שניות...
timeout /t 5 /nobreak >nul

echo.
echo 📊 בודק סטטוס:
%COMPOSE_CMD% ps

echo.
echo 📋 לוגים אחרונים:
%COMPOSE_CMD% logs legal-templates --tail=50

echo.
echo ================================================
echo.
echo אם הקונטיינר במצב "Exited", צלמי מסך של הלוגים למעלה!
echo.
pause

