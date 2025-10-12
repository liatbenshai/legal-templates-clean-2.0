@echo off
echo ====================================
echo   Prepare Project for Manual Upload
echo ====================================
echo.

echo Creating a clean copy of the project...
echo.

cd /d "%~dp0"

:: Create temp folder
set TEMP_FOLDER=legal-templates-ready-for-upload
if exist "%TEMP_FOLDER%" rmdir /s /q "%TEMP_FOLDER%"
mkdir "%TEMP_FOLDER%"

echo Copying files...
xcopy /E /I /Y /EXCLUDE:upload-exclude.txt . "%TEMP_FOLDER%" >nul 2>&1

:: Create exclude list if not exists
if not exist "upload-exclude.txt" (
  echo node_modules\>> upload-exclude.txt
  echo .next\>> upload-exclude.txt
  echo .git\>> upload-exclude.txt
  echo .vercel\>> upload-exclude.txt
  echo *.bat>> upload-exclude.txt
)

echo.
echo ====================================
echo   Files are ready!
echo ====================================
echo.
echo Location: %CD%\%TEMP_FOLDER%
echo.
echo Next steps:
echo   1. Compress the folder "%TEMP_FOLDER%" to ZIP
echo   2. Go to Vercel Dashboard
echo   3. Settings - General - "Delete Project"
echo   4. Create new project - Upload the ZIP
echo.
echo OR (easier):
echo   1. Go to your project settings
echo   2. Redeploy from Git if connected
echo.
pause

explorer "%TEMP_FOLDER%"

