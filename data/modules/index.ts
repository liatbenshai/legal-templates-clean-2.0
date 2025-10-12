import { Module } from '../../types/advanceDirectives.types';
import { M01_RealEstate } from './M01-RealEstate';
import { M02_BankAccounts } from './M02-BankAccounts';
import { M03_Allowances } from './M03-Allowances';
import { M06_GeneralProhibitions } from './M06-GeneralProhibitions';

// Import all other modules here as you create them
// import { M04_Investments } from './M04-Investments';
// import { M05_Vehicle } from './M05-Vehicle';
// ... etc

export const ALL_MODULES: Record<string, Module> = {
  M01: M01_RealEstate,
  M02: M02_BankAccounts,
  M03: M03_Allowances,
  M06: M06_GeneralProhibitions,
  // M04: M04_Investments,
  // M05: M05_Vehicle,
  // ... add all modules
};

export const getModuleById = (moduleId: string): Module | undefined => {
  return ALL_MODULES[moduleId];
};

export const getModulesByCategory = (category: 'property' | 'personal' | 'medical'): Module[] => {
  return Object.values(ALL_MODULES).filter(m => m.category === category);
};

export const getMandatoryModules = (): Module[] => {
  return Object.values(ALL_MODULES).filter(m => m.isMandatory);
};

