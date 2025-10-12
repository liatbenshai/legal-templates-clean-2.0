/**
 * מנוע תבניות פשוט להחלפת משתנים בטקסט
 */

export interface TemplateContext {
  [key: string]: any;
}

/**
 * מחליף משתנים בטקסט התבנית
 * תומך ב:
 * - {{variable}} - משתנה פשוט
 * - {{#if condition}}...{{/if}} - תנאי
 * - {{#each array}}...{{/each}} - לולאה
 */
export const renderTemplate = (template: string, context: TemplateContext): string => {
  let result = template;

  // החלף משתנים פשוטים
  result = replaceSimpleVariables(result, context);

  // טפל בתנאים
  result = processConditionals(result, context);

  // טפל בלולאות
  result = processLoops(result, context);

  return result;
};

/**
 * מחליף משתנים פשוטים מהסוג {{variable}}
 */
const replaceSimpleVariables = (text: string, context: TemplateContext): string => {
  return text.replace(/\{\{([^#\/][^}]*)\}\}/g, (match, variable) => {
    const trimmedVar = variable.trim();
    const value = getNestedValue(context, trimmedVar);
    return value !== undefined && value !== null ? String(value) : '';
  });
};

/**
 * מטפל בתנאים מהסוג {{#if condition}}...{{/if}}
 */
const processConditionals = (text: string, context: TemplateContext): string => {
  const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  return text.replace(ifRegex, (match, condition, content) => {
    const trimmedCondition = condition.trim();
    const value = getNestedValue(context, trimmedCondition);
    
    // אם הערך קיים ולא false/null/undefined/0/""
    if (value && value !== false && value !== 0 && value !== '') {
      return replaceSimpleVariables(content, context);
    }
    
    return '';
  });
};

/**
 * מטפל בלולאות מהסוג {{#each array}}...{{/each}}
 */
const processLoops = (text: string, context: TemplateContext): string => {
  const eachRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  return text.replace(eachRegex, (match, arrayName, content) => {
    const trimmedArrayName = arrayName.trim();
    const array = getNestedValue(context, trimmedArrayName);
    
    if (!Array.isArray(array)) {
      return '';
    }
    
    return array.map((item, index) => {
      const itemContext = {
        ...context,
        ...item,
        index: index + 1,
        isFirst: index === 0,
        isLast: index === array.length - 1
      };
      return replaceSimpleVariables(content, itemContext);
    }).join('\n');
  });
};

/**
 * מחזיר ערך מתוך אובייקט מקונן לפי נתיב
 * לדוגמה: "user.address.city"
 */
const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
};

/**
 * יוצר context מלא עבור מודול ספציפי
 */
export const createModuleContext = (
  userProfile: any,
  moduleData: any,
  sectionData: any
): TemplateContext => {
  return {
    ...userProfile,
    ...moduleData,
    ...sectionData.fieldValues
  };
};

