@echo off
chcp 65001 > nul
cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║    📦 הכנת המערכת להעלאה לשרת           ║
echo ╚════════════════════════════════════════════╝
echo.

echo 🔧 שלב 1: התקנת תלויות...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בהתקנת תלויות!
    pause
    exit /b 1
)

echo.
echo ✅ התקנה הושלמה!
echo.

echo 🏗️  שלב 2: בניית המערכת...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ שגיאה בבנייה!
    pause
    exit /b 1
)

echo.
echo ✅ בנייה הושלמה!
echo.

echo 📦 שלב 3: יצירת תיקיית העלאה...
echo.

REM מחק תיקייה ישנה אם קיימת
if exist "server-upload" (
    echo מוחק תיקייה ישנה...
    rd /s /q "server-upload"
)

REM צור תיקייה חדשה
mkdir "server-upload"

echo 📋 שלב 4: העתקת קבצים חיוניים...
echo.

REM העתק package.json
copy "package.json" "server-upload\" > nul
echo ✓ package.json

REM העתק package-lock.json
copy "package-lock.json" "server-upload\" > nul
echo ✓ package-lock.json

REM העתק next.config.js
copy "next.config.js" "server-upload\" > nul
echo ✓ next.config.js

REM העתק server.js
copy "server.js" "server-upload\" > nul
echo ✓ server.js

REM העתק .next
echo.
echo מעתיק קבצי build...
xcopy ".next" "server-upload\.next\" /E /I /Y > nul
echo ✓ .next/

REM העתק public
xcopy "public" "server-upload\public\" /E /I /Y > nul
echo ✓ public/

REM צור start script
echo const { spawn } = require('child_process'); > "server-upload\start.js"
echo const server = spawn('npm', ['start'], { stdio: 'inherit', shell: true }); >> "server-upload\start.js"
echo ✓ start.js

echo.
echo ╔════════════════════════════════════════════╗
echo ║         ✅✅✅ הצלחה! ✅✅✅              ║
echo ╚════════════════════════════════════════════╝
echo.
echo 📂 הקבצים מוכנים בתיקייה: server-upload\
echo.
echo 📤 צעדים הבאים:
echo.
echo    1. דחס את התיקייה server-upload לקובץ ZIP
echo    2. העלה את ה-ZIP לשרת דרך cPanel/FTP
echo    3. חלץ את הקבצים בשרת
echo    4. התחבר ב-SSH והרץ:
echo       cd [path-to-folder]
echo       npm install --production
echo       npm run build
echo       npm start
echo.
echo 🌐 השרת ירוץ על פורט 3000
echo.
echo 💡 קרא את SERVER-SIMPLE-GUIDE.md למדריך מפורט!
echo.
pause

