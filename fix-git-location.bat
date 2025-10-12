@echo off
echo ====================================
echo   Fix Git Location
echo ====================================
echo.

echo Removing wrong Git folder from home directory...
rd /s /q "C:\Users\liat\.git" 2>nul

echo.
echo Initializing Git in project directory...
cd /d "%~dp0"
git init

echo.
echo Done! Git is now in the correct location.
echo.
pause

