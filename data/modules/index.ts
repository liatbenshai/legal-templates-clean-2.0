import { Module } from '../../types/advanceDirectives.types';

// יצוא ריק בינתיים - המודולים ייווספו בהדרגה
export const ALL_MODULES: Record<string, Module> = {};

export const getModuleById = (moduleId: string): Module | undefined => {
  return ALL_MODULES[moduleId];
};

export const getModulesByCategory = (category: 'property' | 'personal' | 'medical'): Module[] => {
  return Object.values(ALL_MODULES)
    .filter(m => m.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getMandatoryModules = (): Module[] => {
  return Object.values(ALL_MODULES)
    .filter(m => m.isMandatory)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getAllModulesSorted = (): Module[] => {
  return Object.values(ALL_MODULES)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

