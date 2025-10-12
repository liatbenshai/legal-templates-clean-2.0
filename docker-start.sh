#!/bin/bash

echo "🚀 מתחיל להריץ את מערכת התבניות המשפטיות ב-Docker..."
echo ""

# בדיקה אם Docker פועל
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker לא פועל. אנא הפעל את Docker Desktop והרץ שוב."
    exit 1
fi

echo "✅ Docker פועל"
echo ""

# ניקוי containers ישנים (אם קיימים)
echo "🧹 מנקה containers ישנים..."
docker-compose down 2>/dev/null

echo ""
echo "📦 בונה את התמונה... (זה יכול לקחת מספר דקות בפעם הראשונה)"
docker-compose build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ שגיאה בבניית התמונה"
    exit 1
fi

echo ""
echo "🎬 מפעיל את האפליקציה..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ שגיאה בהפעלת האפליקציה"
    exit 1
fi

echo ""
echo "⏳ ממתין שהאפליקציה תהיה מוכנה..."
sleep 5

echo ""
echo "✅ האפליקציה פועלת!"
echo ""
echo "📱 גש לכתובת: http://localhost:3000"
echo ""
echo "📋 פקודות שימושיות:"
echo "   docker-compose logs -f        - צפייה בלוגים"
echo "   docker-compose stop           - עצירת האפליקציה"
echo "   docker-compose down           - עצירה ומחיקת containers"
echo "   docker-compose restart        - הפעלה מחדש"
echo ""

