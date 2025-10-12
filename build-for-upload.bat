@echo off
chcp 65001 > nul
echo.
echo ============================================
echo 🏗️  בניית המערכת להעלאה לשרת
echo ============================================
echo.

echo 📦 שלב 1: התקנת תלויות...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ שגיאה בהתקנת תלויות
    pause
    exit /b 1
)
echo ✅ תלויות הותקנו
echo.

echo 🔨 שלב 2: בניית המערכת...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ שגיאה בבנייה
    pause
    exit /b 1
)
echo ✅ בנייה הושלמה
echo.

echo 📁 שלב 3: יצירת תיקיית העלאה...
if exist "upload-ready" rd /s /q "upload-ready"
mkdir "upload-ready"

echo 📋 שלב 4: העתקת קבצים...
xcopy "out\*" "upload-ready\" /E /I /Y > nul
copy ".htaccess" "upload-ready\" > nul 2>&1

echo.
echo ============================================
echo ✅✅✅ הצלחה! ✅✅✅
echo ============================================
echo.
echo 📂 הקבצים מוכנים להעלאה בתיקייה:
echo    👉 upload-ready\
echo.
echo 📤 צעדים הבאים:
echo.
echo    1. פתח את מנהל הקבצים בשרת (cPanel/FTP)
echo    2. עבור לתיקיית public_html או www
echo    3. העלה את כל התוכן מתיקיית upload-ready
echo    4. וודא שקובץ .htaccess הועלה
echo    5. סיימת! 🎉
echo.
echo 🌐 הכנס לדומיין שלך: https://your-domain.co.il
echo.
pause

