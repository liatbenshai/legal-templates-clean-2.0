@echo off
chcp 65001 >nul
echo ====================================
echo   FINAL CLEAN UPLOAD
echo ====================================
echo.
echo This will start fresh - no history, no problems!
echo.
echo Press any key to start...
pause >nul
echo.

cd /d "%~dp0"

echo Step 1: Delete Git folder completely...
if exist ".git" (
    rd /s /q ".git"
    echo Done!
)

echo.
echo Step 2: Delete node_modules folders...
if exist "components\node_modules" (
    echo Deleting components\node_modules (this is the big one!)...
    rd /s /q "components\node_modules"
    echo Done!
)

if exist "node_modules" (
    echo NOTE: Keeping root node_modules for now
    echo (Vercel will install it automatically anyway)
)

echo.
echo Step 3: Create proper .gitignore...
(
echo # Dependencies
echo node_modules/
echo components/node_modules/
echo.
echo # Build output
echo .next/
echo out/
echo dist/
echo build/
echo.
echo # Vercel
echo .vercel/
echo.
echo # Logs
echo *.log
echo npm-debug.log*
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # IDE
echo .vscode/
echo .idea/
) > .gitignore
echo Done!

echo.
echo Step 4: Initialize fresh Git...
git init
echo Done!

echo.
echo Step 5: Add files (excluding node_modules)...
git add .
echo Done!

echo.
echo Step 6: Commit...
git commit -m "Initial commit - Legal templates system with sections warehouse fixes"
echo Done!

echo.
echo Step 7: Set main branch...
git branch -M main
echo Done!

echo.
echo Step 8: Connect to GitHub...
git remote add origin https://github.com/liatbenshai/legal-templates-clean-2.0.git
echo Done!

echo.
echo Step 9: Force push (clean start)...
echo This will take about a minute...
echo.
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   SUCCESS!!!
    echo ====================================
    echo.
    echo Files uploaded to GitHub successfully!
    echo.
    echo NEXT STEP - Connect Vercel:
    echo   1. Go to: https://vercel.com/legal-templates-clean/settings/git
    echo   2. Click: "Connect Git Repository"
    echo   3. Choose: GitHub
    echo   4. Select: legal-templates-clean-2.0
    echo   5. Click: "Connect"
    echo.
    echo Vercel will auto-deploy in 2-3 minutes!
    echo.
    echo Your fixes will be live:
    echo   - Custom sections load in will editor
    echo   - Sections import saves to correct warehouse
    echo.
) else (
    echo.
    echo ====================================
    echo   STILL AN ERROR?
    echo ====================================
    echo.
    echo If you see the same error about the large file,
    echo it means GitHub still has it cached.
    echo.
    echo SOLUTION: Delete the GitHub repository and create new one
    echo   1. Go to: https://github.com/liatbenshai/legal-templates-clean-2.0/settings
    echo   2. Scroll down to "Delete this repository"
    echo   3. Create NEW repository: legal-templates-clean-2.0
    echo   4. Run this script again
    echo.
)

pause

