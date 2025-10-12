@echo off
echo ====================================
echo   Deploy Fix to Vercel
echo ====================================
echo.

echo Checking git status...
git status

echo.
echo Adding changes...
git add components/SectionsManager.tsx
git add public/clear-old-imports.html

echo.
echo Committing...
git commit -m "Fix: תיקון ייבוא סעיפים - שמירה במפתח נכון לפי warehouse"

echo.
echo Pushing to main...
git push origin main

echo.
echo ====================================
echo   Vercel will auto-deploy!
echo   Check: https://vercel.com/dashboard
echo ====================================
echo.
pause

