/**
 * מחסן כתבי בית משפט - צוואות, ירושות ואפוטרופסות - קובץ מאחד
 * משלב את כל הסעיפים המתקדמים בתחום זה
 */

import { CourtSectionTemplate } from './court-warehouse';
import { willsSections } from './court-warehouse-wills-inheritance-part1';
import { willContestSections } from './court-warehouse-wills-inheritance-part2';
import { guardianshipSections } from './court-warehouse-wills-inheritance-part3';

/**
 * מחסן מאוחד - צוואות, ירושות ואפוטרופסות
 */
export const willsInheritanceGuardianshipWarehouse: CourtSectionTemplate[] = [
  ...willsSections,           // 4 סעיפי צוואות
  ...willContestSections,     // 4 סעיפי התנגדות
  ...guardianshipSections     // 4 סעיפי אפוטרופסות
];

/**
 * סטטיסטיקות
 */
export const stats = {
  wills: willsSections.length,
  contests: willContestSections.length,
  guardianship: guardianshipSections.length,
  total: willsInheritanceGuardianshipWarehouse.length
};

/**
 * קבלת סעיפים לפי קטגוריה
 */
export function getSectionsByCategory(category: 'wills' | 'contests' | 'guardianship'): CourtSectionTemplate[] {
  switch (category) {
    case 'wills':
      return willsSections;
    case 'contests':
      return willContestSections;
    case 'guardianship':
      return guardianshipSections;
    default:
      return [];
  }
}

/**
 * קבלת סעיפים לפי סוג צוואה
 */
export function getWillSectionsByType(willType: 'holographic' | 'witnessed' | 'notarial' | 'any'): CourtSectionTemplate[] {
  const typeMap: Record<string, string[]> = {
    'holographic': ['holographic-will-probate'],
    'witnessed': ['witnessed-will-probate'],
    'notarial': ['notarial-will-probate'],
    'any': ['will-probate-petition-basic']
  };
  
  const ids = typeMap[willType] || [];
  return willsInheritanceGuardianshipWarehouse.filter(s => ids.includes(s.id));
}

/**
 * קבלת סעיפי התנגדות לפי עילה
 */
export function getContestSectionsByGround(ground: 'capacity' | 'influence' | 'fraud' | 'procedural' | 'later-will' | 'public-policy'): CourtSectionTemplate[] {
  const groundMap: Record<string, string> = {
    'capacity': 'will-contest-lack-of-capacity',
    'influence': 'will-contest-undue-influence',
    'fraud': 'will-contest-fraud-forgery',
    'procedural': 'will-contest-procedural-defects',
    'later-will': 'will-contest-later-will',
    'public-policy': 'will-contest-public-policy'
  };
  
  const id = groundMap[ground];
  return willsInheritanceGuardianshipWarehouse.filter(s => s.id === id);
}

/**
 * קבלת סעיפי אפוטרופסות לפי סוג
 */
export function getGuardianshipSectionsByType(type: 'minor' | 'adult' | 'temporary' | 'property-only' | 'general'): CourtSectionTemplate[] {
  const typeMap: Record<string, string> = {
    'minor': 'guardianship-for-minor',
    'adult': 'guardianship-for-incapacitated-adult',
    'temporary': 'guardianship-temporary-urgent',
    'property-only': 'guardianship-property-only',
    'general': 'guardianship-petition-comprehensive'
  };
  
  const id = typeMap[type];
  return guardianshipSections.filter(s => s.id === id);
}

/**
 * חיפוש מתקדם
 */
export function searchWillsInheritance(query: string): CourtSectionTemplate[] {
  const lowerQuery = query.toLowerCase();
  return willsInheritanceGuardianshipWarehouse.filter(
    section =>
      section.title.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery) ||
      section.usageInstructions.toLowerCase().includes(lowerQuery)
  );
}

/**
 * קבלת כל הסעיפים הנדרשים לתביעת צוואה מלאה
 */
export function getCompleteWillProbatePackage(): CourtSectionTemplate[] {
  return willsInheritanceGuardianshipWarehouse.filter(s =>
    [
      'will-probate-petition-basic',
      'will-provisions-real-estate',
      'will-provisions-movable-property',
      'executor-appointment-details'
    ].includes(s.id)
  );
}

/**
 * קבלת כל הסעיפים הנדרשים להתנגדות מלאה
 */
export function getCompleteContestPackage(): CourtSectionTemplate[] {
  return willsInheritanceGuardianshipWarehouse.filter(s =>
    s.documentTypes?.includes('will-contest')
  );
}

/**
 * קבלת כל הסעיפים הנדרשים לבקשת אפוטרופסות מלאה
 */
export function getCompleteGuardianshipPackage(): CourtSectionTemplate[] {
  return guardianshipSections;
}

/**
 * סינון לפי מספר משתנים (פשוט/מורכב)
 */
export function filterByComplexity(min: number, max: number): CourtSectionTemplate[] {
  return willsInheritanceGuardianshipWarehouse.filter(
    s => s.variables.length >= min && s.variables.length <= max
  );
}

/**
 * קבלת סעיף לפי ID
 */
export function getSectionById(id: string): CourtSectionTemplate | undefined {
  return willsInheritanceGuardianshipWarehouse.find(s => s.id === id);
}

/**
 * סטטיסטיקות מפורטות
 */
export function getDetailedStats() {
  const totalVariables = willsInheritanceGuardianshipWarehouse.reduce(
    (sum, s) => sum + s.variables.length, 0
  );
  
  const avgVariables = Math.round(totalVariables / willsInheritanceGuardianshipWarehouse.length);
  
  const variablesCounts = willsInheritanceGuardianshipWarehouse.map(s => s.variables.length);
  const minVariables = Math.min(...variablesCounts);
  const maxVariables = Math.max(...variablesCounts);
  
  return {
    totalSections: willsInheritanceGuardianshipWarehouse.length,
    breakdown: stats,
    variables: {
      total: totalVariables,
      average: avgVariables,
      min: minVariables,
      max: maxVariables
    }
  };
}

/**
 * דוגמאות שימוש
 */
export const usageExamples = {
  // צוואה בכתב יד
  holographicWill: () => [
    getSectionById('will-probate-petition-basic'),
    getSectionById('holographic-will-probate'),
    getSectionById('will-provisions-real-estate')
  ],
  
  // התנגדות בגלל חוסר כשרות
  contestCapacity: () => [
    getSectionById('will-contest-opening-comprehensive'),
    getSectionById('will-contest-lack-of-capacity')
  ],
  
  // אפוטרופסות לקטין
  guardianMinor: () => [
    getSectionById('guardianship-petition-comprehensive'),
    getSectionById('guardianship-for-minor')
  ],
  
  // אפוטרופסות דחופה
  urgentGuardian: () => [
    getSectionById('guardianship-petition-comprehensive'),
    getSectionById('guardianship-temporary-urgent')
  ],
  
  // חיפוש כל סעיפי הצוואות
  allWills: () => getSectionsByCategory('wills'),
  
  // כל עילות ההתנגדות
  allContestGrounds: () => getSectionsByCategory('contests')
};

/**
 * יצוא כל המודולים
 */
export {
  willsSections,
  willContestSections,
  guardianshipSections
};

