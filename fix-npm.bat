@echo off
chcp 65001 >nul
echo.
echo 🔧 מתקן בעיות npm ו-node_modules...
echo.

echo ⏳ שלב 1: עוצר תהליכי Node.js שרצים...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo 🗑️  שלב 2: מוחק תיקיית node_modules (זה יכול לקחת דקה)...
if exist node_modules (
    rmdir /s /q node_modules
    if exist node_modules (
        echo ⚠️  נכשל במחיקה רגילה, מנסה עם כוח...
        rd /s /q node_modules >nul 2>&1
    )
)

echo.
echo 🗑️  שלב 3: מוחק package-lock.json...
if exist package-lock.json del /f /q package-lock.json

echo.
echo 🧹 שלב 4: מנקה npm cache...
call npm cache clean --force

echo.
echo 📦 שלב 5: מתקין מחדש (זה יקח 2-3 דקות)...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ עדיין יש בעיה!
    echo.
    echo 🔍 פתרונות נוספים:
    echo 1. סגור את האנטי-וירוס זמנית והרץ שוב
    echo 2. הפעל את הסקריפט הזה כמנהל מערכת ^(Run as Administrator^)
    echo 3. אם התיקייה בכונן רשת, העתק את הפרויקט לכונן מקומי ^(C:\^)
    echo.
    pause
    exit /b 1
)

echo.
echo ✅✅✅ התיקון הצליח! ✅✅✅
echo.
echo כעת אפשר להריץ:
echo   npm run dev          - להפעלה רגילה
echo   docker-start.bat     - להפעלה ב-Docker
echo.
pause

