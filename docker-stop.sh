#!/bin/bash

echo "🛑 עוצר את מערכת התבניות המשפטיות..."
docker-compose down

echo ""
echo "✅ האפליקציה הופסקה"
echo ""
echo "להפעלה מחדש, הרץ: ./docker-start.sh"
echo ""

