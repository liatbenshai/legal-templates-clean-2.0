// ============================================
// טיפוסים למערכת הנחיות מקדימות בייפוי כוח מתמשך
// ============================================

export type Category = 'property' | 'personal' | 'medical';
export type ModuleId = string;

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
  fields: DynamicField[];
  conditions?: VariantCondition[];
}

export interface VariantCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
  source?: 'userProfile' | 'moduleData';
}

export interface Subsection {
  id: string;
  parentSectionId: string;
  name: string;
  nameHe: string;
  displayOrder: number;
  variants: Variant[];
}

export interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean' | 'textarea' | 'array';
  label: string;
  labelHe: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
  arrayItemSchema?: DynamicField[];
}

export interface FieldOption {
  value: string;
  label: string;
  labelHe: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface UserProfile {
  fullName: string;
  idNumber: string;
  birthDate: string;
  age: number;
  address: string;
  phone: string;
  email?: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  spouseName?: string;
  hasRealEstate: boolean;
  hasBankAccounts: boolean;
  hasInvestments: boolean;
  hasVehicle: boolean;
  hasPension: boolean;
  hasAllowances: boolean;
  healthFund: 'clalit' | 'maccabi' | 'meuhedet' | 'leumit';
  hasChronicDiseases: boolean;
  needsCareAssistance: boolean;
  isDisabledVeteran: boolean;
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
  moduleData: Record<ModuleId, ModuleUserData>;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'complete';
}

export interface ModuleUserData {
  moduleId: ModuleId;
  sections: Record<string, SectionUserData>;
}

export interface SectionUserData {
  sectionId: string;
  selectedVariantId?: string;
  fieldValues: Record<string, any>;
  subsections?: Record<string, SectionUserData>;
}

export interface GeneratedDocument {
  documentId: string;
  html: string;
  metadata: {
    modulesCount: number;
    sectionsCount: number;
    generatedAt: Date;
  };
}

export interface DocumentSection {
  categoryName: string;
  categoryNameHe: string;
  modules: {
    moduleName: string;
    moduleNameHe: string;
    content: string;
  }[];
}

