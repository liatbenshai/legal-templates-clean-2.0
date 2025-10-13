@echo off
chcp 65001 >nul
echo.
echo 📁 מעתיק את הפרויקט לכונן מקומי...
echo.
echo 🔍 הבעיה: הפרויקט נמצא ב-Google Drive שחוסם קבצים
echo ✅ הפתרון: העתקה לכונן C:\ המקומי
echo.

set SOURCE=%~dp0
set TARGET=C:\Projects\legal-templates

echo מעתיק מ: %SOURCE%
echo אל: %TARGET%
echo.

if exist "%TARGET%" (
    echo ⚠️  התיקייה %TARGET% כבר קיימת!
    echo.
    choice /C YN /M "האם למחוק ולהעתיק מחדש"
    if errorlevel 2 (
        echo ביטול...
        pause
        exit /b 0
    )
    echo 🗑️  מוחק תיקייה ישנה...
    rmdir /s /q "%TARGET%"
)

echo.
echo 📦 יוצר תיקייה...
mkdir "%TARGET%" 2>nul
if not exist "C:\Projects" mkdir "C:\Projects"
if not exist "%TARGET%" mkdir "%TARGET%"

echo.
echo 📋 מעתיק קבצים (ללא node_modules, זה יקח כ-30 שניות)...
robocopy "%SOURCE%" "%TARGET%" /E /XD node_modules .next .git /XF *.log /NFL /NDL /NJH /NJS /nc /ns /np

if %ERRORLEVEL% GEQ 8 (
    echo ❌ שגיאה בהעתקה!
    pause
    exit /b 1
)

echo.
echo ✅ ההעתקה הושלמה!
echo.
echo 📂 הפרויקט עכשיו ב: %TARGET%
echo.
echo 🚀 עכשיו מריץ התקנה במיקום החדש...
cd /d "%TARGET%"

echo.
echo 📦 מתקין תלויות...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בהתקנה
    echo אבל הקבצים הועתקו ל: %TARGET%
    echo נסי להריץ שם ידנית: npm install
    pause
    exit /b 1
)

echo.
echo ✅✅✅ הכל מוכן! ✅✅✅
echo.
echo 📁 הפרויקט במיקום החדש: %TARGET%
echo.
echo 🎯 כעת תוכלי להריץ:
echo    cd /d "%TARGET%"
echo    npm run dev           - פיתוח רגיל
echo    docker-start.bat      - Docker
echo.
echo 💡 פותחת את התיקייה החדשה...
explorer "%TARGET%"
echo.
pause

