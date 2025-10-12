@echo off
echo ====================================
echo   Connect to GitHub
echo ====================================
echo.

echo Step 1: Create a new repository on GitHub
echo   1. Go to: https://github.com/new
echo   2. Repository name: legal-templates-clean
echo   3. Keep it Private
echo   4. DON'T initialize with README
echo   5. Click "Create repository"
echo.
pause

echo.
echo Step 2: Copy the commands from GitHub
echo   GitHub will show you commands like:
echo   git remote add origin https://github.com/YOUR-USERNAME/legal-templates-clean.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo   Copy the URL from GitHub and paste here:
echo.

set /p GITHUB_URL="Paste GitHub repository URL: "

echo.
echo Step 3: Adding remote and pushing...
git remote add origin %GITHUB_URL%
git branch -M main
git add .
git commit -m "Fix: Load custom sections in will editor and sections manager"
git push -u origin main

echo.
echo ====================================
echo   Now connect to Vercel:
echo ====================================
echo   1. Go to: https://vercel.com/dashboard
echo   2. Click "Add New..." - "Project"
echo   3. Import from GitHub
echo   4. Select: legal-templates-clean
echo   5. Click "Deploy"
echo.
echo   Future updates will auto-deploy on git push!
echo.
pause

