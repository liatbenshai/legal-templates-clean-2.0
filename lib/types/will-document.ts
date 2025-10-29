// טיפוסים למערכת עריכת הצוואות החדשה

export interface InheritanceTable {
  id: string;                    // מזהה ייחודי (table-1, table-2...)
  type: 'table';                 // תמיד 'table'
  label: string;                 // שם פנימי למערכת (לא מוצג בייצוא)
  heirs: Array<{
    name: string;
    id: string;
    relationship: string;
    percentage: number;
  }>;
  order: number;                 // מיקום בסדר הכללי
}

export interface WillSection {
  id: string;                    // מזהה הסעיף
  type: 'section';               // תמיד 'section'
  content: string;               // התוכן של הסעיף
  order: number;                 // מיקום בסדר הכללי
  isDefault: boolean;            // האם זה סעיף דיפולטיבי
  variables?: Record<string, any>; // משתנים לסעיף
}

export interface WillDocument {
  willType: 'individual' | 'mutual';
  items: Array<InheritanceTable | WillSection>; // מערך מאוחד של טבלאות וסעיפים
}

// טיפוס עזר לזיהוי סוג הפריט
export type WillItem = InheritanceTable | WillSection;

// פונקציות עזר לזיהוי סוג
export function isInheritanceTable(item: WillItem): item is InheritanceTable {
  return item.type === 'table';
}

export function isWillSection(item: WillItem): item is WillSection {
  return item.type === 'section';
}
