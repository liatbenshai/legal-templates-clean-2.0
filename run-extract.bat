@echo off
cd /d "%~dp0"
echo Running from: %CD%
node "%~dp0extract-json.js"
if errorlevel 1 (
  echo ERROR: Script failed!
  pause
  exit /b 1
)
echo.
echo Script completed successfully!
pause

