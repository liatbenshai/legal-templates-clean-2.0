@echo off
chcp 65001 >nul
echo.
echo 🔧 תיקון מלא של המערכת
echo.

echo 🧹 שלב 1: מנקה npm cache מושחת...
call npm cache clean --force

echo.
echo 🗑️  שלב 2: מוחק node_modules אם קיים...
if exist node_modules (
    echo מוחק node_modules...
    rmdir /s /q node_modules
)

echo.
echo 🗑️  שלב 3: מוחק package-lock.json...
if exist package-lock.json del /f /q package-lock.json

echo.
echo 🗑️  שלב 4: מוחק .next אם קיים...
if exist .next (
    rmdir /s /q .next
)

echo.
echo 📦 שלב 5: מתקין תלויות מחדש (3-5 דקות)...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בהתקנה!
    pause
    exit /b 1
)

echo.
echo 🔨 שלב 6: בונה את הפרויקט...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבנייה!
    echo.
    echo 📋 ראה את השגיאה למעלה
    pause
    exit /b 1
)

echo.
echo ✅✅✅ התיקון הושלם בהצלחה! ✅✅✅
echo.
echo 🎯 כעת תוכלי להריץ:
echo    npm run dev          - פיתוח רגיל
echo    quick-start.bat      - Docker
echo.
pause

