@echo off
chcp 65001 >nul
echo ====================================
echo   Fix and Upload to GitHub
echo ====================================
echo.

cd /d "%~dp0"

echo Forcing push to GitHub...
echo (This will overwrite any files on GitHub - that's OK!)
echo.

git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   SUCCESS! Files uploaded!
    echo ====================================
    echo.
    echo Next step:
    echo   1. Go to: https://vercel.com/legal-templates-clean/settings/git
    echo   2. Click "Connect Git Repository"
    echo   3. Select GitHub
    echo   4. Choose: legal-templates-clean-2.0
    echo   5. Vercel will auto-deploy!
    echo.
) else (
    echo.
    echo ====================================
    echo   ERROR!
    echo ====================================
    echo.
    echo Please check if you're logged into GitHub.
    echo Run: git config --global user.name "Your Name"
    echo Run: git config --global user.email "your@email.com"
    echo.
)

pause

