@echo off
chcp 65001 > nul
cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║    🚀 העלאה ל-Vercel (בלי Git!)          ║
echo ╚════════════════════════════════════════════╝
echo.

echo 🔍 בודק אם Vercel מותקן...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Vercel לא מותקן!
    echo.
    echo 📦 מתקין Vercel...
    call npm install -g vercel
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ שגיאה בהתקנת Vercel
        echo.
        echo 💡 נסה להריץ את הפקודה הזו ידנית:
        echo    npm install -g vercel
        echo.
        pause
        exit /b 1
    )
)

echo ✅ Vercel מותקן!
echo.

echo ╔════════════════════════════════════════════╗
echo ║         📋 הוראות חשובות!                ║
echo ╚════════════════════════════════════════════╝
echo.
echo 1. עכשיו דפדפן ייפתח
echo 2. התחבר עם כתובת המייל שלך
echo 3. אשר את החיבור
echo 4. חזור לכאן
echo.
pause

echo.
echo 🔐 מתחבר ל-Vercel...
call vercel login

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ החיבור נכשל
    pause
    exit /b 1
)

echo.
echo ✅ התחברת בהצלחה!
echo.

echo ╔════════════════════════════════════════════╗
echo ║       🚀 מעלה את הפרויקט...              ║
echo ╚════════════════════════════════════════════╝
echo.
echo 📌 שימי לב לשאלות:
echo    - Set up and deploy? → לחצי Enter
echo    - Link to existing project? → N ואז Enter
echo    - Project name? → legal-templates ואז Enter
echo    - Directory? → פשוט Enter
echo.
pause

echo.
call vercel

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════╗
    echo ║      🎉🎉🎉 הצלחה! 🎉🎉🎉            ║
    echo ╚════════════════════════════════════════════╝
    echo.
    echo ✅ המערכת הועלתה בהצלחה!
    echo.
    echo 🌐 המערכת שלך זמינה בלינק שהתקבל למעלה
    echo.
    echo 📋 צעדים הבאים (אופציונלי):
    echo.
    echo    לחיבור הדומיין שלך:
    echo    1. עבור ל-https://vercel.com/dashboard
    echo    2. בחר את הפרויקט legal-templates
    echo    3. Settings → Domains
    echo    4. הוסף את your-domain.co.il
    echo    5. עקוב אחרי ההוראות
    echo.
    echo 💡 זה יקח 24 שעות עד שהדומיין יעבוד
    echo.
) else (
    echo.
    echo ❌ משהו השתבש
    echo.
    echo 💡 פתרונות:
    echo    1. ודא שאתה מחובר לאינטרנט
    echo    2. נסה שוב
    echo    3. אם זה לא עובד - ספר לי מה השגיאה
    echo.
)

pause

