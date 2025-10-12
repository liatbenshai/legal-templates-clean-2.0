// ===================================
// סוגי נתונים למערכת הנחיות מקדימות
// ===================================

export type Category = 'property' | 'personal' | 'medical';

export type ModuleId = 
  | 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06'  // Property
  | 'M07' | 'M08' | 'M09' | 'M10' | 'M11' | 'M12'  // Personal
  | 'M13' | 'M14' | 'M15' | 'M16'                  // Personal continued
  | 'M17' | 'M18' | 'M19' | 'M20' | 'M21' | 'M22' | 'M23'; // Medical

export interface Module {
  id: ModuleId;
  name: string;
  nameHe: string;
  category: Category;
  isMandatory: boolean;
  displayOrder: number;
  description?: string;
  sections: Section[];
}

export interface Section {
  id: string;
  moduleId: ModuleId;
  name: string;
  nameHe: string;
  displayOrder: number;
  isRequired: boolean;
  variants: Variant[];
  subsections?: Subsection[];
}

export interface Variant {
  id: string;
  sectionId: string;
  name: string;
  nameHe: string;
  textTemplate: string;
  conditions?: VariantCondition[];
  fields?: DynamicField[];
}

export interface VariantCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
}

export interface Subsection {
  id: string;
  name: string;
  nameHe: string;
  variants: Variant[];
}

export interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean' | 'textarea' | 'array';
  label: string;
  labelHe: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  validation?: FieldValidation;
  arrayItemSchema?: DynamicField[]; // For array type
}

export interface FieldOption {
  value: string;
  label: string;
  labelHe: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  customRule?: (value: any) => boolean;
  errorMessage?: string;
}

// ===================================
// User Input Types
// ===================================

export interface UserProfile {
  // Basic Info
  fullName: string;
  idNumber: string;
  birthDate: string;
  age: number;
  address: string;
  phone: string;
  email?: string;
  
  // Marital Status
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  spouseName?: string;
  
  // Financial Status
  hasRealEstate: boolean;
  numberOfProperties?: number;
  hasBankAccounts: boolean;
  numberOfBankAccounts?: number;
  hasInvestments: boolean;
  hasVehicle: boolean;
  hasPension: boolean;
  hasAllowances: boolean;
  
  // Medical Status
  healthFund: 'clalit' | 'maccabi' | 'meuhedet' | 'leumit';
  hasChronicDiseases: boolean;
  chronicDiseases?: string[];
  needsCareAssistance: boolean;
  
  // Special Status
  isDisabledVeteran: boolean;
  modDepartment?: string;
  
  // Preferences
  preferences?: {
    detailLevel: 'basic' | 'standard' | 'detailed';
    includeOptionalModules: boolean;
  };
}

export interface AttorneyInfo {
  isPrimary: boolean;
  fullName: string;
  idNumber: string;
  relationship: string;
  address: string;
  phone: string;
  email?: string;
}

export interface UserDocumentData {
  documentId: string;
  userId: string;
  userProfile: UserProfile;
  attorneys: AttorneyInfo[];
  selectedModules: ModuleId[];
  moduleData: Record<string, ModuleUserData>;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'complete' | 'signed';
}

export interface ModuleUserData {
  moduleId: ModuleId;
  sections: Record<string, SectionUserData>;
}

export interface SectionUserData {
  sectionId: string;
  selectedVariantId: string;
  fieldValues: Record<string, any>;
  subsections?: Record<string, SectionUserData>;
}

// ===================================
// Document Generation Types
// ===================================

export interface GeneratedDocument {
  html: string;
  metadata: {
    generatedAt: Date;
    documentId: string;
    userName: string;
    attorneyNames: string[];
  };
}

export interface DocumentSection {
  title: string;
  content: string;
  subsections?: DocumentSection[];
}

