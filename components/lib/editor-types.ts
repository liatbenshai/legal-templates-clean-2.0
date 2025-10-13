// סוגי בלוקים שונים במסמך
export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3'
  | 'heading4'
  | 'bullet-list'
  | 'numbered-list'
  | 'table'
  | 'signature-block'
  | 'date-block'
  | 'page-break'
  | 'horizontal-rule'
  | 'indented-text'
  | 'blockquote'
  | 'legal-section';

export type TextAlignment = 'right' | 'left' | 'center' | 'justify';
export type TextDirection = 'rtl' | 'ltr';

// סגנון טקסט
export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: number; // בנקודות
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: TextAlignment;
  lineHeight?: number;
  letterSpacing?: number;
}

// בלוק תוכן במסמך
export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string | TableContent | ListContent;
  style?: TextStyle;
  metadata?: BlockMetadata;
  children?: ContentBlock[]; // לתמיכה בבלוקים מקוננים
}

// מטה-דאטה לבלוק
export interface BlockMetadata {
  level?: number; // רמת כותרת או הזחה
  listStyle?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman';
  startNumber?: number; // מספר התחלה לרשימה ממוספרת
  indent?: number; // רמת הזחה (0-5)
  marginTop?: number;
  marginBottom?: number;
  borderTop?: boolean;
  borderBottom?: boolean;
  pageBreakBefore?: boolean;
  pageBreakAfter?: boolean;
}

// תוכן טבלה
export interface TableContent {
  rows: TableRow[];
  columnWidths?: number[]; // רוחב עמודות באחוזים
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderWidth?: number;
  borderColor?: string;
  cellPadding?: number;
  headerRow?: boolean; // האם השורה הראשונה היא כותרת
}

export interface TableRow {
  id: string;
  cells: TableCell[];
  isHeader?: boolean;
}

export interface TableCell {
  id: string;
  content: string;
  colspan?: number;
  rowspan?: number;
  style?: TextStyle;
  backgroundColor?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

// תוכן רשימה
export interface ListContent {
  items: ListItem[];
}

export interface ListItem {
  id: string;
  content: string;
  level: number; // רמת קינון
  style?: TextStyle;
  children?: ListItem[]; // פריטים מקוננים
}

// מבנה המסמך המלא
export interface DocumentStructure {
  id: string;
  title: string;
  blocks: ContentBlock[];
  pageSettings: PageSettings;
  styles: DocumentStyles;
  metadata: DocumentMetadata;
}

// הגדרות עמוד
export interface PageSettings {
  size: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header?: string;
  footer?: string;
  pageNumbers?: boolean;
  pageNumberPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// סגנונות ברירת מחדל למסמך
export interface DocumentStyles {
  defaultFont: string;
  defaultFontSize: number;
  defaultLineHeight: number;
  direction: TextDirection;
  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;
  heading4: TextStyle;
  paragraph: TextStyle;
  legalSection: TextStyle;
}

// מטה-דאטה של המסמך
export interface DocumentMetadata {
  author?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  templateId?: string;
  language: 'he' | 'en' | 'ar';
}

// טמפלייט עם מבנה מסמך
export interface TemplateWithStructure {
  id: string;
  title: string;
  description: string;
  category: string;
  document: DocumentStructure;
  fields: TemplateField[];
  tags: string[];
  version: string;
  isPublic: boolean;
}

// ממשק TemplateField (imported from types.ts)
export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select' | 'checkbox' | 'email' | 'phone' | 'id-number' | 'address';
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: any;
  helpText?: string;
  order: number;
  group?: string;
}

// ממשק לעורך
export interface EditorState {
  document: DocumentStructure;
  selectedBlockId: string | null;
  history: DocumentStructure[];
  historyIndex: number;
  isModified: boolean;
}

// פעולות עורך
export type EditorAction =
  | { type: 'ADD_BLOCK'; block: ContentBlock; position?: number }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<ContentBlock> }
  | { type: 'MOVE_BLOCK'; blockId: string; newPosition: number }
  | { type: 'CHANGE_BLOCK_TYPE'; blockId: string; newType: BlockType }
  | { type: 'UPDATE_STYLE'; blockId: string; style: Partial<TextStyle> }
  | { type: 'INSERT_TABLE'; rows: number; columns: number; position?: number }
  | { type: 'UPDATE_TABLE_CELL'; blockId: string; rowIndex: number; cellIndex: number; content: string }
  | { type: 'ADD_TABLE_ROW'; blockId: string; position?: number }
  | { type: 'ADD_TABLE_COLUMN'; blockId: string; position?: number }
  | { type: 'DELETE_TABLE_ROW'; blockId: string; rowIndex: number }
  | { type: 'DELETE_TABLE_COLUMN'; blockId: string; columnIndex: number }
  | { type: 'MERGE_CELLS'; blockId: string; cells: { row: number; col: number }[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_PAGE_SETTINGS'; settings: Partial<PageSettings> };

