#!/bin/bash

# 🧹 סקריפט ניקוי כפילויות - עם גיבוי אוטומטי
# תאריך: $(date +%Y-%m-%d)

set -e  # עצור אם יש שגיאה

# צבעים יפים לטרמינל
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🧹 ניקוי כפילויות באפליקציה        ║${NC}"
echo -e "${BLUE}║  📦 עם גיבוי אוטומטי                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# שלב 1: יצירת תיקיית גיבוי
BACKUP_DIR="backup_before_cleanup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}📦 יוצר תיקיית גיבוי: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"
echo ""

# פונקציה לגיבוי לפני מחיקה
backup_and_delete() {
    local path=$1
    local description=$2
    
    if [ -e "$path" ]; then
        echo -e "${BLUE}🔍 נמצא: $path${NC}"
        
        # יצירת מבנה תיקיות בגיבוי
        local backup_path="$BACKUP_DIR/$path"
        mkdir -p "$(dirname "$backup_path")"
        
        # העתקה לגיבוי
        cp -r "$path" "$backup_path"
        echo -e "${GREEN}✅ גובה ל: $backup_path${NC}"
        
        # מחיקה
        rm -rf "$path"
        echo -e "${RED}🗑️  נמחק: $path${NC}"
        echo -e "   📝 $description"
        echo ""
        
        return 0
    else
        echo -e "${YELLOW}⚠️  לא נמצא: $path (כבר נמחק?)${NC}"
        echo ""
        return 1
    fi
}

# שלב 2: מחיקות בטוחות 100%
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  שלב 1: מחיקות בטוחות 100%${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# 1. תיקייה components/lib/
backup_and_delete "components/lib" "תיקייה כפולה - אף אחד לא משתמש בה"

# 2. דפים ישנים
backup_and_delete "app/documents/will-old" "גרסה ישנה של דף צוואה"
backup_and_delete "app/documents/advance-directives-test" "דף בדיקות"

# 3. קומפוננטה לא בשימוש
backup_and_delete "components/AdvanceDirectivesDocumentClean.tsx" "גרסה ישנה - לא בשימוש"

# שלב 3: דוח סיכום
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ סיימתי!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📊 סיכום:${NC}"
echo "• כל הקבצים שנמחקו גובו אוטומטית"
echo "• מיקום הגיבוי: $BACKUP_DIR"
echo ""

echo -e "${YELLOW}💡 כדי לשחזר קובץ ספציפי:${NC}"
echo "   cp -r $BACKUP_DIR/[נתיב_הקובץ] [נתיב_הקובץ]"
echo ""

echo -e "${YELLOW}💡 כדי לשחזר הכל:${NC}"
echo "   cp -r $BACKUP_DIR/* ."
echo ""

echo -e "${YELLOW}💡 אם הכל עובד טוב, אפשר למחוק את הגיבוי:${NC}"
echo "   rm -rf $BACKUP_DIR"
echo ""

echo -e "${GREEN}🎉 ניקוי הסתיים בהצלחה!${NC}"
echo ""

# בדיקת git status
if command -v git &> /dev/null; then
    echo -e "${BLUE}📝 סטטוס Git:${NC}"
    git status --short
fi

