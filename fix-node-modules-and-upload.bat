@echo off
chcp 65001 >nul
echo ====================================
echo   Fix node_modules and Upload
echo ====================================
echo.

cd /d "%~dp0"

echo Step 1: Remove node_modules from git tracking...
git rm -r --cached components/node_modules 2>nul
git rm -r --cached node_modules 2>nul
echo Done!

echo.
echo Step 2: Make sure .gitignore is correct...
echo node_modules/ > .gitignore
echo .next/ >> .gitignore
echo .vercel/ >> .gitignore
echo *.log >> .gitignore
echo .DS_Store >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore
echo.
echo Done!

echo.
echo Step 3: Add .gitignore...
git add .gitignore
echo Done!

echo.
echo Step 4: Commit changes...
git commit -m "Fix: Remove node_modules from git tracking"
echo Done!

echo.
echo Step 5: Push to GitHub (forcing)...
echo This will take a minute...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   SUCCESS! Files uploaded!
    echo ====================================
    echo.
    echo Next: Connect Vercel to GitHub
    echo   1. Go to: https://vercel.com/legal-templates-clean/settings/git
    echo   2. Click "Connect Git Repository"  
    echo   3. Select GitHub
    echo   4. Choose: legal-templates-clean-2.0
    echo   5. Vercel will auto-deploy!
    echo.
) else (
    echo.
    echo ====================================
    echo   Still having issues?
    echo ====================================
    echo.
    echo The files might be too large.
    echo Let's delete node_modules completely and try again.
    echo.
)

pause

