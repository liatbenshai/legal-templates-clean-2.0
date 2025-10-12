@echo off
chcp 65001 >nul
echo ====================================
echo   Upload to GitHub
echo ====================================
echo.

cd /d "%~dp0"

echo Step 1: Remove wrong git folder...
if exist "C:\Users\liat\.git" (
    rd /s /q "C:\Users\liat\.git"
    echo Done!
)

echo.
echo Step 2: Initialize Git in project folder...
git init
echo Done!

echo.
echo Step 3: Add all files...
git add .
echo Done!

echo.
echo Step 4: Commit...
git commit -m "Fix: Load custom sections in will editor and sections manager"
echo Done!

echo.
echo Step 5: Connect to GitHub...
git remote add origin https://github.com/liatbenshai/legal-templates-clean.git
echo Done!

echo.
echo Step 6: Set main branch...
git branch -M main
echo Done!

echo.
echo Step 7: Push to GitHub...
echo This might take a minute...
git push -u origin main

echo.
echo ====================================
echo   SUCCESS!
echo ====================================
echo.
echo Now connect Vercel to GitHub:
echo   1. Go to: https://vercel.com/legal-templates-clean/settings/git
echo   2. Click "Connect Git Repository"
echo   3. Select GitHub
echo   4. Choose: legal-templates-clean
echo   5. Click Deploy!
echo.
pause

