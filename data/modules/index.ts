import { Module } from '../../types/advanceDirectives.types';

// Import all modules
import { M01_RealEstate } from './M01-RealEstate';
import { M02_BankAccounts } from './M02-BankAccounts';
import { M03_Allowances } from './M03-Allowances';
import { M04_Investments } from './M04-Investments';
import { M05_Vehicle } from './M05-Vehicle';
import { M06_GeneralProhibitions } from './M06-GeneralProhibitions';
import { M07_CareAndResidence } from './M07-CareAndResidence';
import { M08_SocialRelations } from './M08-SocialRelations';
import { M09_LivingEnvironment } from './M09-LivingEnvironment';
import { M10_Nutrition } from './M10-Nutrition';
import { M11_PersonalCare } from './M11-PersonalCare';
import { M12_PhysicalActivity } from './M12-PhysicalActivity';
import { M13_CultureLeisure } from './M13-CultureLeisure';
import { M14_Technology } from './M14-Technology';
import { M15_SecurityPrivacy } from './M15-SecurityPrivacy';
import { M16_Travel } from './M16-Travel';
import { M17_MedicalDecisions } from './M17-MedicalDecisions';
import { M18_EndOfLife } from './M18-EndOfLife';
import { M19_PainManagement } from './M19-PainManagement';
import { M20_ChronicDiseases } from './M20-ChronicDiseases';
import { M21_MedicalProviders } from './M21-MedicalProviders';
import { M22_Insurance } from './M22-Insurance';
import { M23_OrganDonation } from './M23-OrganDonation';

export const ALL_MODULES: Record<string, Module> = {
  // Property (רכושי)
  M01: M01_RealEstate,
  M02: M02_BankAccounts,
  M03: M03_Allowances,
  M04: M04_Investments,
  M05: M05_Vehicle,
  M06: M06_GeneralProhibitions,
  
  // Personal (אישי)
  M07: M07_CareAndResidence,
  M08: M08_SocialRelations,
  M09: M09_LivingEnvironment,
  M10: M10_Nutrition,
  M11: M11_PersonalCare,
  M12: M12_PhysicalActivity,
  M13: M13_CultureLeisure,
  M14: M14_Technology,
  M15: M15_SecurityPrivacy,
  M16: M16_Travel,
  
  // Medical (רפואי)
  M17: M17_MedicalDecisions,
  M18: M18_EndOfLife,
  M19: M19_PainManagement,
  M20: M20_ChronicDiseases,
  M21: M21_MedicalProviders,
  M22: M22_Insurance,
  M23: M23_OrganDonation,
};

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

export const getOptionalModules = (): Module[] => {
  return Object.values(ALL_MODULES)
    .filter(m => !m.isMandatory)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getAllModulesSorted = (): Module[] => {
  return Object.values(ALL_MODULES)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};
