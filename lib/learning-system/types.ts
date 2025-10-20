// טיפוסים למערכת הלמידה והעריכה

export interface EditableSection {
  id: string;
  title: string;
  content: string;
  originalContent?: string; // תוכן מקורי לפני עריכה
  category: 'fee_agreement' | 'will' | 'advance_directive' | 'custom';
  serviceType?: string; // סוג שירות (הסכמי ממון, צוואה וכו')
  isEditable: boolean;
  isCustom: boolean; // האם זה סעיף מותאם אישית
  isFixed?: boolean; // האם זה סעיף קבוע
  isEnabled?: boolean; // האם הסעיף מופעל
  level?: 'main' | 'sub' | 'sub-sub'; // רמת הסעיף
  subSections?: Array<{
    id: string;
    content: string;
    order: number;
  }>; // תתי סעיפים
  version: number; // גרסה של הסעיף
  lastModified: string;
  modifiedBy: string; // מי ערך
}

export interface LearningData {
  sectionId: string;
  originalText: string;
  editedText: string;
  editType: 'manual' | 'ai_suggested' | 'ai_approved';
  userFeedback?: 'approved' | 'rejected' | 'improved';
  context: {
    serviceType: string;
    category: string;
    userType: string; // סוג משתמש (עו"ד, לקוח וכו')
  };
  timestamp: string;
  userId: string;
}

export interface WarehouseSection {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
  averageRating: number;
  isPublic: boolean; // האם זמין לכל המשתמשים
  createdBy: string;
  createdAt: string;
  lastUsed: string;
}

export interface AIInsight {
  sectionId: string;
  suggestion: string;
  reason: string;
  confidence: number; // 0-1
  type: 'improvement' | 'clarity' | 'legal_accuracy' | 'style';
}

export interface UserLearningProfile {
  userId: string;
  preferredStyle: {
    formalLevel: 'high' | 'medium' | 'low';
    languageStyle: 'formal' | 'casual' | 'technical';
    preferredTerms: string[];
  };
  editingHistory: LearningData[];
  customSections: WarehouseSection[];
  aiPreferences: {
    autoSuggest: boolean;
    learningEnabled: boolean;
    styleAdaptation: boolean;
  };
}

export interface SectionEditAction {
  type: 'save_to_warehouse' | 'save_to_learning' | 'revert' | 'ai_improve';
  sectionId: string;
  newContent: string;
  reason?: string;
  userId: string;
  timestamp: string;
}
