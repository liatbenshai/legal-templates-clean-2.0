@echo off
echo ====================================
echo   Upload Fixed Code to Vercel
echo ====================================
echo.

cd /d "%~dp0"

echo Step 1: Initialize Git (if needed)
if not exist ".git" (
    git init
    echo Git initialized!
) else (
    echo Git already initialized
)

echo.
echo Step 2: Add files
git add components/SectionsManager.tsx
git add public/clear-old-imports.html
git add deploy-fix.bat

echo.
echo Step 3: Commit
git commit -m "Fix: Import sections to correct warehouse storage key"

echo.
echo ====================================
echo   Now you have 2 options:
echo ====================================
echo.
echo Option 1 - Using Vercel Dashboard:
echo   1. Go to: https://vercel.com/dashboard
echo   2. Find your project: legal-templates-clean  
echo   3. Click "Deployments" 
echo   4. Click "Redeploy" on the latest deployment
echo.
echo Option 2 - Install Vercel CLI:
echo   1. Run: npm install -g vercel
echo   2. Run: vercel --prod
echo.
echo ====================================
pause

