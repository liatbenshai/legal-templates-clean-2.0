@echo off
chcp 65001 >nul
echo.
echo ====================================
echo העלאה ל-GitHub
echo ====================================
echo.

cd /d "%~dp0"

echo בודק את ה-Git...
git status

echo.
echo מעלה ל-GitHub...
git push -u origin main

echo.
echo ✓ הועלה בהצלחה!
echo.
pause

