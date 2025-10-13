@echo off
chcp 65001 >nul
echo.
echo 🔍 בודק מה קרה למערכת...
echo.

REM זיהוי docker compose או docker-compose
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

echo 📊 סטטוס הקונטיינרים:
echo ================================
%COMPOSE_CMD% ps -a
echo.

echo 📋 לוגים של הקונטיינר:
echo ================================
%COMPOSE_CMD% logs legal-templates --tail=100
echo.
echo ================================

echo.
echo 💡 אם יש שגיאה למעלה, צלמי מסך ושלחי לי!
echo.
pause

