@echo off
chcp 65001 >nul
echo.
echo 🛑 עוצר את מערכת התבניות המשפטיות...
docker-compose down

echo.
echo ✅ האפליקציה הופסקה
echo.
echo להפעלה מחדש, הרץ: docker-start.bat
echo.
pause

