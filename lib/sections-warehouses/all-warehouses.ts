/**
 * קובץ מרכזי המאחד את כל מחסני הסעיפים
 */

import { sectionsWarehouse as willsSections } from '../professional-will-texts';
import { courtSectionsWarehouse } from './court-warehouse';
import { feeAgreementsWarehouse } from './fee-agreements-warehouse';
import { poaSectionsWarehouse } from './power-of-attorney-warehouse';
import { affidavitSectionsWarehouse } from './affidavits-warehouse';
import { contractSectionsWarehouse } from './contracts-warehouse';
import { businessSectionsWarehouse } from './business-warehouse';
import { employmentSectionsWarehouse } from './employment-warehouse';
import { propertySectionsWarehouse } from './property-agreements-warehouse';
import { individualWillsSectionsWarehouse } from './individual-wills-warehouse';
import { mutualWillsSectionsWarehouse } from './mutual-wills-warehouse';

// הגדרת סוגי מחסנים
export type WarehouseType = 
  | 'wills'
  | 'court'
  | 'fee-agreements'
  | 'power-of-attorney'
  | 'affidavits'
  | 'contracts'
  | 'business'
  | 'employment'
  | 'property'
  | 'individual-wills'
  | 'mutual-wills';

// מידע על כל מחסן
export interface WarehouseInfo {
  id: WarehouseType;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// רשימת כל המחסנים
export const WAREHOUSES: WarehouseInfo[] = [
  {
    id: 'wills',
    name: 'צוואות מקצועיות',
    icon: '📜',
    description: 'סעיפים לצוואות מקצועיות ומורכבות',
    color: 'blue'
  },
  {
    id: 'individual-wills',
    name: 'צוואות פרטיות',
    icon: '📝',
    description: 'סעיפים לצוואות פשוטות ופרטיות',
    color: 'indigo'
  },
  {
    id: 'mutual-wills',
    name: 'צוואות הדדיות',
    icon: '💑',
    description: 'סעיפים לצוואות הדדיות של זוגות',
    color: 'pink'
  },
  {
    id: 'court',
    name: 'כתבי בית משפט',
    icon: '⚖️',
    description: 'סעיפים לכתבי טענות, ערעורים ותביעות',
    color: 'green'
  },
  {
    id: 'fee-agreements',
    name: 'הסכמי שכר טרחה',
    icon: '💰',
    description: 'סעיפים להסכמי שכ"ט עם לקוחות',
    color: 'yellow'
  },
  {
    id: 'power-of-attorney',
    name: 'ייפויי כוח',
    icon: '✍️',
    description: 'סעיפים לייפויי כוח כלליים ומיוחדים',
    color: 'purple'
  },
  {
    id: 'affidavits',
    name: 'תצהירים',
    icon: '✅',
    description: 'סעיפים לתצהירים משפטיים',
    color: 'teal'
  },
  {
    id: 'contracts',
    name: 'חוזים',
    icon: '📄',
    description: 'סעיפים לחוזים מסוגים שונים',
    color: 'cyan'
  },
  {
    id: 'business',
    name: 'עסקים',
    icon: '🏢',
    description: 'סעיפים להסכמים עסקיים ותאגידים',
    color: 'orange'
  },
  {
    id: 'employment',
    name: 'יחסי עבודה',
    icon: '👔',
    description: 'סעיפים לחוזי עבודה והסכמים',
    color: 'red'
  },
  {
    id: 'property',
    name: 'נדל"ן',
    icon: '🏠',
    description: 'סעיפים לעסקאות נדל"ן',
    color: 'emerald'
  }
];

// פונקציה לקבלת סעיפים לפי סוג מחסן
export function getSectionsByWarehouse(warehouseType: WarehouseType): any[] {
  switch (warehouseType) {
    case 'wills':
      return willsSections;
    case 'court':
      return courtSectionsWarehouse;
    case 'fee-agreements':
      return feeAgreementsWarehouse;
    case 'power-of-attorney':
      return poaSectionsWarehouse;
    case 'affidavits':
      return affidavitSectionsWarehouse;
    case 'contracts':
      return contractSectionsWarehouse;
    case 'business':
      return businessSectionsWarehouse;
    case 'employment':
      return employmentSectionsWarehouse;
    case 'property':
      return propertySectionsWarehouse;
    case 'individual-wills':
      return individualWillsSectionsWarehouse;
    case 'mutual-wills':
      return mutualWillsSectionsWarehouse;
    default:
      return [];
  }
}

// פונקציה לקבלת כל הסעיפים מכל המחסנים
export function getAllSections(): any[] {
  return [
    ...willsSections.map(s => ({ ...s, warehouse: 'wills' as WarehouseType })),
    ...courtSectionsWarehouse.map(s => ({ ...s, warehouse: 'court' as WarehouseType })),
    ...feeAgreementsWarehouse.map(s => ({ ...s, warehouse: 'fee-agreements' as WarehouseType })),
    ...poaSectionsWarehouse.map(s => ({ ...s, warehouse: 'power-of-attorney' as WarehouseType })),
    ...affidavitSectionsWarehouse.map(s => ({ ...s, warehouse: 'affidavits' as WarehouseType })),
    ...contractSectionsWarehouse.map(s => ({ ...s, warehouse: 'contracts' as WarehouseType })),
    ...businessSectionsWarehouse.map(s => ({ ...s, warehouse: 'business' as WarehouseType })),
    ...employmentSectionsWarehouse.map(s => ({ ...s, warehouse: 'employment' as WarehouseType })),
    ...propertySectionsWarehouse.map(s => ({ ...s, warehouse: 'property' as WarehouseType })),
    ...individualWillsSectionsWarehouse.map(s => ({ ...s, warehouse: 'individual-wills' as WarehouseType })),
    ...mutualWillsSectionsWarehouse.map(s => ({ ...s, warehouse: 'mutual-wills' as WarehouseType }))
  ];
}

// פונקציה לקבלת מידע על מחסן
export function getWarehouseInfo(warehouseType: WarehouseType): WarehouseInfo | undefined {
  return WAREHOUSES.find(w => w.id === warehouseType);
}

