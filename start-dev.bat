@echo off
chcp 65001 >nul
echo.
echo 🚀 מפעיל את המערכת במצב פיתוח (בלי Docker)...
echo.
echo 🌐 המערכת תהיה זמינה ב: http://localhost:3000
echo.
echo 💡 לחצי Ctrl+C כדי לעצור
echo.
echo ================================================
echo.
call npm run dev

