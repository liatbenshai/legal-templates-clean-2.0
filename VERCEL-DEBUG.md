# 🔍 Vercel Debug - למה 404?

## הבעיה
```
404 על /documents/advance-directives
```

## אבחון:

### אפשרות 1: Build עדיין רץ ⏳
- Vercel עדיין בונה
- **פתרון:** המתיני 2-3 דקות נוספות

### אפשרות 2: Build נכשל ❌
- יש שגיאת TypeScript/Import
- **פתרון:** בדקי ב-Vercel Dashboard

### אפשרות 3: הקובץ לא נבנה 🏗️
- Next.js לא בנה את העמוד
- **פתרון:** בדקי .next folder (אם היה local build)

---

## 🔧 פתרון מיידי

בואי ניצור **עמוד סטטי פשוט** שבטוח יעבוד:

### קובץ מינימלי שבטוח עובד:
```typescript
export default function AdvanceDirectivesPage() {
  return (
    <div className="p-8">
      <h1>הנחיות מקדימות - עובד!</h1>
    </div>
  );
}
```

אם **גם זה** לא עובד → הבעיה ב-routing של Next.js

---

## 📊 מה לבדוק ב-Vercel:

1. **Dashboard:** https://vercel.com/dashboard
2. **בחרי את הפרויקט**
3. **לחצי על deployment האחרון** (commit `fb51bba` או `204c5f4`)
4. **לחצי "View Build Logs"**
5. **חפשי:**
   - "Failed to compile"
   - "Error"
   - "advance-directives"

---

## 🎯 בדיקה מהירה

**נסי את הגרסה הפשוטה:**
```
https://legal-templates-clean-psvyd4vzs.vercel.app/documents/advance-directives-simple
```

**אם זו עובדת →** הבעיה ב-`AdvanceDirectivesDocumentClean`  
**אם גם זו לא עובדת →** בעיה בrouting

