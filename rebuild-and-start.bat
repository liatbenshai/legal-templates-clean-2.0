@echo off
chcp 65001 >nul
echo.
echo 🔄 בונה מחדש ומפעיל את המערכת החדשה...
echo.

echo 🔨 שלב 1: בונה את הפרויקט...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבנייה!
    echo ראה את השגיאה למעלה
    pause
    exit /b 1
)

echo.
echo ✅ הבנייה הצליחה!
echo.
echo 🚀 שלב 2: מפעיל את המערכת...
echo.
echo 🌐 המערכת תהיה זמינה ב: http://localhost:3000
echo.
echo 💡 לחצי Ctrl+C כדי לעצור
echo.
echo ================================================
echo.
start http://localhost:3000
call npm start

