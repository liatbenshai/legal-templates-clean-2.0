export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string; // תוכן התבנית עם placeholders
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author?: string;
  version: string;
  isPublic: boolean;
  hasGenderSupport?: boolean; // תמיכה בנטיות מגדר
  metadata?: Record<string, any>; // מטא-דאטה נוספת
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select' | 'checkbox' | 'email' | 'phone' | 'id-number' | 'address';
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  options?: string[]; // for select type
  validation?: FieldValidation;
  helpText?: string; // טקסט עזרה למשתמש
  order: number; // סדר הצגה
  group?: string; // קיבוץ שדות
  genderSensitive?: boolean; // השדה מושפע מנטיות מגדר
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex pattern
  min?: number; // for number type
  max?: number; // for number type
  customMessage?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  description?: string;
  parentId?: string; // לתמיכה בקטגוריות מקוננות
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface FilledTemplate {
  id: string;
  templateId: string;
  title: string;
  filledData: Record<string, any>; // הנתונים שמילא המשתמש
  createdAt: string;
  updatedAt: string;
  userId?: string;
  status: 'draft' | 'completed' | 'exported';
}

// לניהול התגיות הדינמי
export interface TemplateWithDynamicContent {
  template: Template;
  renderedContent: string; // התוכן אחרי החלפת השדות
}
