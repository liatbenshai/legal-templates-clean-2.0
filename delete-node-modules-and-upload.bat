@echo off
chcp 65001 >nul
echo ====================================
echo   Clean and Upload to GitHub
echo ====================================
echo.

cd /d "%~dp0"

echo Step 1: Delete node_modules folders (they are huge!)...
echo This might take a minute...
if exist "components\node_modules" (
    echo Deleting components\node_modules...
    rd /s /q "components\node_modules"
    echo Done!
)

if exist "node_modules" (
    echo Keeping root node_modules for now (needed for development)
    echo But we'll exclude it from Git
)

echo.
echo Step 2: Update .gitignore...
(
echo node_modules/
echo .next/
echo .vercel/
echo *.log
echo .DS_Store
echo dist/
echo build/
echo out/
) > .gitignore
echo Done!

echo.
echo Step 3: Remove node_modules from git tracking...
git rm -r --cached components/node_modules 2>nul
git rm -r --cached node_modules 2>nul
echo Done!

echo.
echo Step 4: Add all files...
git add .
echo Done!

echo.
echo Step 5: Commit...
git commit -m "Fix: Remove node_modules and update gitignore"
echo Done!

echo.
echo Step 6: Push to GitHub (with force)...
echo This will take a minute...
echo.
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   SUCCESS! 
    echo ====================================
    echo.
    echo Files uploaded to GitHub successfully!
    echo.
    echo Next: Connect Vercel
    echo   1. Go to: https://vercel.com/legal-templates-clean/settings/git
    echo   2. Click "Connect Git Repository"
    echo   3. Select: GitHub
    echo   4. Choose: legal-templates-clean-2.0
    echo   5. Click "Connect"
    echo   6. Vercel will auto-deploy!
    echo.
) else (
    echo.
    echo ====================================
    echo   ERROR
    echo ====================================
    echo.
    echo Something went wrong.
    echo Please send me the error message above.
    echo.
)

pause

