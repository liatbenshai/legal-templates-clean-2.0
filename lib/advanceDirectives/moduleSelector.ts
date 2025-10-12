import { UserProfile, ModuleId } from '@/types/advanceDirectives.types';

export function selectRelevantModules(userProfile: Partial<UserProfile>): ModuleId[] {
  const modules: ModuleId[] = [];

  // מודולים חובה תמיד
  modules.push('M07', 'M08', 'M09', 'M17', 'M18', 'M19', 'M21', 'M22', 'M23');

  // רכושי
  if (userProfile.hasRealEstate) modules.push('M01');
  if (userProfile.hasBankAccounts) modules.push('M02');
  if (userProfile.hasAllowances) modules.push('M03');
  if (userProfile.hasInvestments || userProfile.hasPension) modules.push('M04');
  if (userProfile.hasVehicle) modules.push('M05');
  modules.push('M06'); // איסורים כלליים - תמיד

  // אישי
  if (userProfile.age && userProfile.age > 60) {
    modules.push('M10', 'M11');
  }
  if (userProfile.hasChronicDiseases) modules.push('M20');

  return modules;
}

