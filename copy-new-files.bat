@echo off
chcp 65001 >nul
echo.
echo 📋 מעתיק קבצים חדשים מ-G:\ ל-C:\...
echo.

set SOURCE=G:\האחסון שלי\פיתוחים לפי תאריך\legal-templates
set TARGET=C:\legal-templates

echo מעתיק קבצים...

REM העתקת קבצי קוד שתוקנו
copy "%SOURCE%\app\templates\page.tsx" "%TARGET%\app\templates\page.tsx" /Y
copy "%SOURCE%\app\editor\page.tsx" "%TARGET%\app\editor\page.tsx" /Y
copy "%SOURCE%\lib\templates.ts" "%TARGET%\lib\templates.ts" /Y
copy "%SOURCE%\docker-compose.yml" "%TARGET%\docker-compose.yml" /Y
copy "%SOURCE%\Dockerfile" "%TARGET%\Dockerfile" /Y
copy "%SOURCE%\.dockerignore" "%TARGET%\.dockerignore" /Y

REM העתקת קבצים חדשים
if not exist "%TARGET%\app\templates\create" mkdir "%TARGET%\app\templates\create"
copy "%SOURCE%\app\templates\create\page.tsx" "%TARGET%\app\templates\create\page.tsx" /Y
copy "%SOURCE%\components\TemplateBuilder.tsx" "%TARGET%\components\TemplateBuilder.tsx" /Y

echo.
echo ✅ כל הקבצים הועתקו!
echo.
pause

