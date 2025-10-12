# תכנית תיקון מלאה: מגדר בכל המסמכים

**תאריך:** 12.10.2025  
**סטטוס:** 🔨 בתיקון

---

## ✅ מה כבר תוקן:

### 1. **הייצוא ל-Word - RTL** ✅
**בעיה:** הייצוא היה משמאל לימין
**תוקן:** הוספתי `rightToLeft: true` להגדרות הסקשן
**קובץ:** `components/ProfessionalWordExporter.tsx` שורה 800

### 2. **יורשים** ✅
**תוקן:** כל יורש יכול להיות זכר או נקבה
**קובץ:** `components/ProfessionalWillForm.tsx`

---

## 🔧 מה עדיין צריך לתקן:

### 1. **מנהל עיזבון (Executor)**

**איפה זה:** `components/DocumentModules/Will.tsx` שורה 37

**לפני:**
```typescript
const [executorInfo, setExecutorInfo] = useState({
  name: '',
  idNumber: '',
  relationship: '',
});
```

**צריך להיות:**
```typescript
const [executorInfo, setExecutorInfo] = useState({
  name: '',
  idNumber: '',
  relationship: '',
  gender: 'male' as Gender // ← חדש!
});
```

**למה זה חשוב:**
- "**המנהל** אחראי" (זכר)
- "**המנהלת** אחראית" (נקבה)

---

### 2. **אפוטרופוס (Guardian)**

**איפה:** צריך להוסיף בכל מקום שמוזכר אפוטרופוס

**צריך:**
```typescript
interface Guardian {
  fullName: string;
  idNumber: string;
  relationship: string;
  gender: 'male' | 'female'; // ← חדש!
}
```

**למה זה חשוב:**
- "**האפוטרופוס** רשאי" (זכר)
- "**האפוטרופסת** רשאית" (נקבה)

---

### 3. **מנהל עסק (Business Manager)**

**איפה:** בסעיפי ניהול עסק בצוואות

**צריך:**
```typescript
interface BusinessManager {
  fullName: string;
  idNumber: string;
  relationship: string;
  gender: 'male' | 'female'; // ← חדש!
}
```

**למה זה חשוב:**
- "**המנהל** ימשיך לנהל" (זכר)
- "**המנהלת** תמשיך לנהל" (נקבה)

---

### 4. **עדים לצוואה (Witnesses)**

**איפה:** `components/ProfessionalWillForm.tsx` שורה 110

**לפני:**
```typescript
interface Witness {
  name: string;
  id: string;
  address: string;
}

const [witnessesGender, setWitnessesGender] = useState<'both-male' | 'both-female' | 'mixed'>('mixed');
```

**בעיה:** `witnessesGender` זה כללי, לא לכל עד בנפרד!

**צריך להיות:**
```typescript
interface Witness {
  name: string;
  id: string;
  address: string;
  gender: 'male' | 'female'; // ← חדש!
}
```

**למה זה חשוב:**
- "**העד חתם**" (זכר)
- "**העדה חתמה**" (נקבה)

---

### 5. **מקבל מתנה / הקדש (Beneficiary)**

**איפה:** בסעיפי מתנות מיוחדות

**צריך:**
```typescript
interface SpecialBequestBeneficiary {
  fullName: string;
  relationship: string;
  gender: 'male' | 'female'; // ← חדש!
  item: string; // מה הוא/היא מקבל/ת
}
```

**למה זה חשוב:**
- "**המקבל** יקבל את הפריט" (זכר)
- "**המקבלת** תקבל את הפריט" (נקבה)

---

### 6. **בן/בת זוג (Spouse)**

**איפה:** `components/ProfessionalWillForm.tsx` שורה 60

**כבר תוקן! ✅** יש gender

---

### 7. **נאמן (Trustee)**

**איפה:** בצוואות עם נאמנויות

**צריך:**
```typescript
interface Trustee {
  fullName: string;
  idNumber: string;
  gender: 'male' | 'female'; // ← חדש!
}
```

**למה זה חשוב:**
- "**הנאמן** ינהל" (זכר)
- "**הנאמנת** תנהל" (נקבה)

---

## 📋 סיכום: איפה צריך להוסיף gender?

| תפקיד | קובץ | שורה | סטטוס |
|-------|------|------|-------|
| **יורש** | ProfessionalWillForm.tsx | 29 | ✅ תוקן |
| **מנהל עיזבון** | Will.tsx | 37 | ❌ צריך תיקון |
| **אפוטרופוס** | - | - | ❌ צריך הוספה |
| **עדים** | ProfessionalWillForm.tsx | 110 | ❌ צריך תיקון |
| **מנהל עסק** | - | - | ❌ צריך הוספה |
| **מקבל מתנה** | - | - | ❌ צריך הוספה |
| **נאמן** | - | - | ❌ צריך הוספה |

---

## 🎯 איך זה צריך לעבוד?

### דוגמה: מנהל עיזבון

**בטופס:**
```tsx
<select
  value={executorInfo.gender}
  onChange={(e) => setExecutorInfo({...executorInfo, gender: e.target.value})}
>
  <option value="male">זכר</option>
  <option value="female">נקבה</option>
</select>
```

**בטקסט:**
```typescript
const text = "מנהל העיזבון אחראי על ביצוע הצוואה";
const genderedText = applyGenderToText(text, executorInfo.gender);
```

**תוצאה:**
- אם זכר: "מנהל העיזבון אחראי על ביצוע הצוואה"
- אם נקבה: "מנהלת העיזבון אחראית על ביצוע הצוואה"

---

## 📝 תכנית פעולה

### שלב 1: עדים (הכי חשוב) ⭐
1. ✅ הוסף `gender` ל-`interface Witness`
2. ✅ הוסף בחירת מגדר בטופס לכל עד
3. ✅ הסר את `witnessesGender` (לא רלוונטי יותר)
4. ✅ החל מגדור בייצוא

### שלב 2: מנהל עיזבון ⭐
1. ✅ הוסף `gender` ל-`executorInfo`
2. ✅ הוסף בחירת מגדר בטופס
3. ✅ החל מגדור בטקסטים

### שלב 3: אפוטרופוס
1. ✅ צור `interface Guardian`
2. ✅ הוסף מערך `guardians` לטופס
3. ✅ הוסף בחירת מגדר לכל אפוטרופוס
4. ✅ החל מגדור בטקסטים

### שלב 4: מנהל עסק
1. ✅ צור `interface BusinessManager`
2. ✅ הוסף לטופס
3. ✅ הוסף בחירת מגדר
4. ✅ החל מגדור בטקסטים

### שלב 5: מקבלי מתנות מיוחדות
1. ✅ צור `interface SpecialBequestBeneficiary`
2. ✅ הוסף מערך למתנות מיוחדות
3. ✅ הוסף בחירת מגדר לכל מקבל
4. ✅ החל מגדור בטקסטים

---

## 🔧 קבצים שצריך לערוך:

### קובץ 1: `components/ProfessionalWillForm.tsx`
- ✅ הוסף gender לעדים
- ✅ הוסף gender למנהל עיזבון
- ✅ הוסף interfaces חדשים

### קובץ 2: `components/DocumentModules/Will.tsx`
- ✅ הוסף gender למנהל עיזבון

### קובץ 3: `lib/hebrew-gender.ts`
- ✅ כבר יש את כל המילים (מנהל, אפוטרופוס, נאמן...)

### קובץ 4: `components/ProfessionalWordExporter.tsx`
- ✅ כבר תוקן RTL
- ✅ ייצוא אוטומטי של מגדור

---

## ✅ מילים שכבר במילון:

```typescript
'המנהל' → { male: 'המנהל', female: 'המנהלת' }
'מנהל' → { male: 'מנהל', female: 'מנהלת' }
'אחראי' → { male: 'אחראי', female: 'אחראית' }
'רשאי' → { male: 'רשאי', female: 'רשאית' }
'מוסמך' → { male: 'מוסמך', female: 'מוסמכת' }
'אפוטרופוס' → { male: 'אפוטרופוס', female: 'אפוטרופסת' }
'האפוטרופוס' → { male: 'האפוטרופוס', female: 'האפוטרופסת' }
'נאמן' → { male: 'נאמן', female: 'נאמנת' }
'מקבל' → { male: 'מקבל', female: 'מקבלת' }
'עד' → { male: 'עד', female: 'עדה' }
```

**הכל מוכן!** רק צריך להוסיף את השדות בטפסים.

---

## 🚀 סיכום:

1. ✅ **הייצוא ל-Word - RTL תוקן!**
2. ✅ **יורשים - תוקן!**
3. ❌ **עדים - צריך תיקון**
4. ❌ **מנהל עיזבון - צריך תיקון**
5. ❌ **אפוטרופוס - צריך הוספה**
6. ❌ **מנהל עסק - צריך הוספה**
7. ❌ **מקבלי מתנות - צריך הוספה**

---

**האם להמשיך ולתקן את כל אלה עכשיו?** 🎯

