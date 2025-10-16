# 🚀 מדריך מעבר ל-Supabase

## 📋 סקירה כללית

המערכת עברה מ-**localStorage** ל-**Supabase** לאחסון נתונים מקצועי וארוך טווח.

---

## 🗄️ **טבלאות שנוצרו**

### 1. **warehouse_sections**
- אחסון כל הסעיפים האישיים
- תמיכה בקטגוריות, תגיות, סעיפים מוסתרים
- מונה שימוש ודירוג

### 2. **learning_data**
- נתוני למידה מתיקונים
- שומר מקורי ומתוקן
- הקשר ופידבק

### 3. **user_preferences**
- העדפות סגנון
- סעיפים מוסתרים
- הגדרות AI

### 4. **advance_directives_hidden_sections**
- סעיפים מוסתרים בהנחיות מקדימות
- נפרד כי זה מחסן קבוע

### 5. **ai_insights**
- תובנות AI אוטומטיות
- המלצות לשיפור

---

## 🔐 **Row Level Security (RLS)**

כל המשתמשים רואים **רק את הנתונים שלהם**:

```sql
- Users can view own sections ✅
- Users can insert own sections ✅  
- Users can update own sections ✅
- Users can delete own sections ✅
```

---

## 🔧 **שינויים בקוד**

### **Hooks חדשים:**

#### `useWarehouse(userId, options)`
```typescript
const {
  sections,          // רשימת סעיפים
  loading,           // סטטוס טעינה
  error,             // שגיאות
  addSection,        // הוספת סעיף
  updateSection,     // עדכון סעיף
  deleteSection,     // מחיקת סעיף
  toggleHideSection, // הסתרה/הצגה
  showAllHidden,     // הצגת כל המוסתרים
  incrementUsage,    // עדכון מונה שימוש
  moveToCategory,    // העברת קטגוריה
  searchSections,    // חיפוש
  reload             // טעינה מחדש
} = useWarehouse(userId);
```

#### `useLearning(userId)`
```typescript
const {
  learningData,        // נתוני למידה
  preferences,         // העדפות משתמש
  saveLearningData,    // שמירת נתוני למידה
  updatePreferences,   // עדכון העדפות
  toggleHiddenSection, // הסתרה/הצגה
  getStatistics        // סטטיסטיקות
} = useLearning(userId);
```

#### `useAdvanceDirectivesHidden(userId)`
```typescript
const {
  hiddenSections,    // רשימת IDs מוסתרים
  toggleHideSection, // הסתרה/הצגה
  showAllSections    // הצגת כולם
} = useAdvanceDirectivesHidden(userId);
```

---

## 📦 **מיגרציה אוטומטית**

כשהמשתמש נכנס לראשונה, המערכת:

1. ✅ בודקת אם כבר בוצעה מיגרציה
2. ✅ מעתיקה את כל הנתונים מ-localStorage ל-Supabase
3. ✅ מציגה הודעת הצלחה
4. ✅ ממשיכה לעבוד עם Supabase

**הפונקציה:** `migrateLocalStorageToSupabase(userId)`

---

## 🎯 **יתרונות המעבר**

| תכונה | localStorage | Supabase |
|-------|-------------|----------|
| **גישה ממכשירים** | ❌ רק המחשב הזה | ✅ כל מקום |
| **גיבוי** | ❌ אין | ✅ אוטומטי |
| **שיתוף** | ❌ לא אפשרי | ✅ בין משתמשים |
| **חיפוש** | ❌ בסיסי | ✅ מתקדם (PostgreSQL) |
| **Real-time** | ❌ לא | ✅ כן! |
| **גודל** | ❌ ~5MB | ✅ ללא הגבלה |

---

## 📊 **שינויי שדות**

שמות השדות שונו לקונבנציית snake_case:

```typescript
// localStorage (ישן)
{
  usageCount: 0,
  averageRating: 0,
  isPublic: false,
  createdBy: "user",
  createdAt: "2024-...",
  lastUsed: "2024-..."
}

// Supabase (חדש)
{
  usage_count: 0,
  average_rating: 0,
  is_public: false,
  created_by: "user",
  created_at: "2024-...",
  last_used: "2024-..."
}
```

---

## 🛠️ **הרצת המיגרציה**

### **בפעם הראשונה:**
```bash
# 1. הרץ את ה-SQL migration ב-Supabase Dashboard
# עלה את הקובץ: supabase/migrations/001_warehouse_and_learning_tables.sql

# 2. הפעל את האפליקציה
npm run dev

# 3. המיגרציה תרוץ אוטומטית!
```

### **איפוס מיגרציה (לבדיקות):**
```typescript
import { resetMigration } from '@/lib/utils/migrateToSupabase';
resetMigration(userId);
```

---

## ⚠️ **שימו לב**

1. **userId חובה** - כל קומפוננטה חייבת לקבל `userId`
2. **Async functions** - כל הפעולות כעת async
3. **Error handling** - טיפול בשגיאות רשת
4. **Loading states** - המתן לטעינה

---

## 🎉 **הושלם!**

המערכת כעת עובדת עם Supabase ומספקת:
- ☁️ שמירה בענן
- 🔄 סינכרון בזמן אמת
- 🔐 אבטחה ברמת משתמש
- 📊 חיפוש וסינון מתקדם
- 💾 גיבוי אוטומטי

---

Created: 2024-10-16
Version: 1.0

