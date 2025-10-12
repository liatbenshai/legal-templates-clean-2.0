@echo off
chcp 65001 >nul
echo.
echo 🧪 בודק שההתקנה עובדת בכונן C:\...
echo.

echo 📦 מתקין תלויות...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ עדיין יש בעיה!
    pause
    exit /b 1
)

echo.
echo ✅ ההתקנה עבדה בלי שגיאות!
echo.
echo 🔨 בודק שהבנייה עובדת...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבנייה - יש בעיה בקוד
    pause
    exit /b 1
)

echo.
echo ✅✅✅ הכל עובד מעולה! ✅✅✅
echo.
echo כעת תוכלי להריץ:
echo   quick-start.bat      - להרצה ב-Docker
echo   npm run dev          - להרצה רגילה
echo.
pause

