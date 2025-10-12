@echo off
echo ====================================
echo   Testing Git Setup
echo ====================================
echo.

cd /d "%~dp0"

echo Current folder:
cd
echo.

echo Testing if Git is installed...
git --version
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo.
echo Git is installed! ✓
echo.

echo Checking if .git folder exists...
if exist ".git" (
    echo .git folder exists ✓
) else (
    echo .git folder does NOT exist
)

echo.
echo Checking if components\node_modules exists...
if exist "components\node_modules" (
    echo WARNING: components\node_modules EXISTS! (This is the problem!)
    echo We need to delete it.
) else (
    echo Good! components\node_modules does NOT exist ✓
)

echo.
echo Checking if node_modules exists...
if exist "node_modules" (
    echo node_modules exists (that's OK, we'll ignore it)
) else (
    echo node_modules does NOT exist
)

echo.
echo ====================================
echo   Test Complete
echo ====================================
echo.
echo Everything looks OK? Press any key to try uploading...
pause

