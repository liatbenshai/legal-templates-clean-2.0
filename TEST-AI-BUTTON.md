# 🔍 בדיקה - איפה כפתור ה-AI?

## מצב נוכחי בקוד (local):

הקוד **כולל** את כפתור ה-AI בשורה **405**:

```typescript
<button
  onClick={() => {
    setEditingSection(index);
    setShowAI(true);
  }}
  className="text-purple-600 hover:text-purple-800 px-3 py-1 border border-purple-300 rounded hover:bg-purple-50 transition text-sm"
  title="שפר עם AI"
>
  ✨ AI
</button>
```

## איך לבדוק ב-Vercel:

1. גשי ל: https://vercel.com/dashboard
2. בחרי את הפרויקט
3. בחרי את הdeployment האחרון (commit `75f0456`)
4. לחצי על "View Build Logs"
5. **אם יש שגיאה** - העתיקי את השגיאה

## אבחון מהיר:

### אם הכפתור לא מופיע - יכול להיות:

1. **Vercel עדיין בונה** ⏳
   - פתרון: המתיני 2-3 דקות

2. **Build נכשל** ❌
   - פתרון: בדקי build logs ב-Vercel

3. **Cache בדפדפן** 🔄
   - פתרון: Ctrl+Shift+R (hard refresh)

4. **הקוד לא נדחף** 📤
   - פתרון: נעשה push מחדש

## בדיקה פשוטה:

נסי את הגרסה הפשוטה:
```
https://legal-templates-clean-psvyd4vzs.vercel.app/documents/advance-directives-simple
```

זו גרסה מינימלית שבטוח תעבוד.

