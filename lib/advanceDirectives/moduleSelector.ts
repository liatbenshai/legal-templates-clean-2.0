import { UserProfile, ModuleId } from '../../types/advanceDirectives.types';
import { ALL_MODULES } from '../../data/modules';

/**
 * קובע אילו מודולים רלוונטיים למשתמש על סמך הפרופיל שלו
 */
export const selectRelevantModules = (profile: UserProfile): ModuleId[] => {
  const selectedModules: ModuleId[] = [];

  // תמיד כלול מודולים חובה
  selectedModules.push('M01', 'M02', 'M06'); // נדל"ן, בנק, איסורים

  // M03: קצבאות - אם יש קצבאות או גיל מעל 60
  if (profile.hasAllowances || profile.age >= 60 || profile.isDisabledVeteran) {
    selectedModules.push('M03');
  }

  // M04: השקעות - אם יש השקעות או רכוש משמעותי
  if (profile.hasInvestments || profile.hasPension) {
    selectedModules.push('M04');
  }

  // M05: רכב - אם יש רכב
  if (profile.hasVehicle) {
    selectedModules.push('M05');
  }

  // M07: סיעוד - אם גיל מעל 65 או נכה או צריך עזרה
  if (profile.age >= 65 || profile.needsCareAssistance || profile.isDisabledVeteran) {
    selectedModules.push('M07');
  }

  // M08-M11: תמיד כלול (קשרים, סביבה, תזונה, טיפוח)
  selectedModules.push('M08', 'M09', 'M10', 'M11');

  // M12: פעילות גופנית - תלוי בגיל ומצב
  if (profile.age < 80) {
    selectedModules.push('M12');
  }

  // M13-M16: תרבות, טכנולוגיה, אבטחה, נסיעות (אופציונלי)
  if (profile.preferences?.includeOptionalModules) {
    selectedModules.push('M13', 'M14', 'M15', 'M16');
  }

  // M17-M23: רפואי - תמיד כלול
  selectedModules.push('M17', 'M18', 'M19', 'M21', 'M23');

  // M20: מחלות כרוניות - אם יש
  if (profile.hasChronicDiseases && profile.chronicDiseases && profile.chronicDiseases.length > 0) {
    selectedModules.push('M20');
  }

  // M22: ביטוחים - תמיד רלוונטי
  selectedModules.push('M22');

  return selectedModules;
};

/**
 * קובע אילו וריאנטים רלוונטיים בכל סעיף על סמך הפרופיל
 */
export const selectRelevantVariant = (
  sectionId: string,
  variants: any[],
  profile: UserProfile,
  moduleData?: any
): string | null => {
  // חפש וריאנט ראשון שמתאים לתנאים
  for (const variant of variants) {
    if (!variant.conditions || variant.conditions.length === 0) {
      return variant.id; // וריאנט ללא תנאים - תמיד מתאים
    }

    // בדוק את כל התנאים
    const allConditionsMet = variant.conditions.every((condition: any) => {
      return evaluateCondition(condition, profile, moduleData);
    });

    if (allConditionsMet) {
      return variant.id;
    }
  }

  // אם אין וריאנט מתאים, החזר את הראשון
  return variants.length > 0 ? variants[0].id : null;
};

/**
 * מעריך תנאי בודד
 */
const evaluateCondition = (
  condition: any,
  profile: UserProfile,
  moduleData?: any
): boolean => {
  const fieldValue = getFieldValue(condition.field, profile, moduleData);

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'not_equals':
      return fieldValue !== condition.value;
    case 'greater_than':
      return Number(fieldValue) > Number(condition.value);
    case 'less_than':
      return Number(fieldValue) < Number(condition.value);
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    case 'not_contains':
      return !String(fieldValue).includes(String(condition.value));
    default:
      return false;
  }
};

/**
 * מחזיר ערך שדה מהפרופיל או מהדאטה של המודול
 */
const getFieldValue = (field: string, profile: UserProfile, moduleData?: any): any => {
  // נסה קודם מהפרופיל
  if (field in profile) {
    return (profile as any)[field];
  }

  // נסה מהדאטה של המודול
  if (moduleData && field in moduleData) {
    return moduleData[field];
  }

  return null;
};

