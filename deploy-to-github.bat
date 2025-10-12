@echo off
chcp 65001 > nul
echo.
echo ============================================
echo 📦 העלאה ל-GitHub
echo ============================================
echo.

REM בדיקה שיש Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git לא מותקן!
    echo.
    echo הורד ב-Git מכאן: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git מותקן
echo.

REM בדיקה אם יש repository
if not exist ".git" (
    echo 🆕 אתחול Git repository...
    git init
    echo.
)

echo 📝 הוספת כל הקבצים...
git add .
echo.

REM בקש הודעת commit
set /p commit_msg="💬 הזן הודעת commit (או Enter לברירת מחדל): "
if "%commit_msg%"=="" set commit_msg=Update project

echo.
echo 💾 יצירת commit...
git commit -m "%commit_msg%"
echo.

REM בדיקה אם יש remote
git remote -v | find "origin" >nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  לא מוגדר GitHub repository!
    echo.
    echo 📋 צעדים:
    echo    1. לך ל-https://github.com/new
    echo    2. צור repository חדש בשם: legal-templates
    echo    3. אל תבחר שום אופציה
    echo    4. לחץ "Create repository"
    echo    5. העתק את ה-URL
    echo.
    set /p repo_url="🔗 הדבק את ה-URL של ה-repository: "
    
    if "%repo_url%"=="" (
        echo ❌ לא הוזן URL
        pause
        exit /b 1
    )
    
    git remote add origin %repo_url%
    echo ✅ Repository חובר!
    echo.
)

echo 🚀 מעלה ל-GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo ✅✅✅ הצלחה! ✅✅✅
    echo ============================================
    echo.
    echo 📌 הקוד הועלה ל-GitHub!
    echo.
    echo 🌟 השלב הבא:
    echo    1. לך ל-https://vercel.com
    echo    2. התחבר עם GitHub
    echo    3. לחץ "New Project"
    echo    4. בחר את legal-templates
    echo    5. לחץ "Deploy"
    echo    6. המתן 3 דקות
    echo    7. סיימת! 🎉
    echo.
) else (
    echo.
    echo ❌ משהו השתבש!
    echo.
    echo 💡 פתרונות אפשריים:
    echo    - ודא שאתה מחובר ל-GitHub
    echo    - בדוק את ה-URL של ה-repository
    echo    - נסה שוב
    echo.
)

pause

