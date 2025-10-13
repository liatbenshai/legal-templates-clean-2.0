@echo off
chcp 65001 >nul
echo.
echo 🧪 בודק אם המערכת עובדת מקומית (בלי Docker)...
echo.

echo 📦 מתקין תלויות...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ שגיאה בהתקנת תלויות!
    pause
    exit /b 1
)

echo.
echo 🔨 בונה את המערכת...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌❌❌ הבנייה נכשלה! ❌❌❌
    echo.
    echo זו הבעיה! יש שגיאה בקוד. תראי את השגיאה למעלה.
    echo צלמי מסך ושלחי לי!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ הבנייה הצליחה!
echo.
echo 🚀 מפעיל את המערכת...
echo.
echo 📱 המערכת תהיה זמינה ב: http://localhost:3000
echo.
echo לחצי Ctrl+C כדי לעצור
echo.
call npm start

