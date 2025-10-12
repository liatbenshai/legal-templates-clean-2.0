import { UserDocumentData, GeneratedDocument, Module } from '../../types/advanceDirectives.types';
import { ALL_MODULES } from '../../data/modules';
import { renderTemplate, createModuleContext } from './templateEngine';

/**
 * יוצר מסמך מלא של הנחיות מקדימות
 */
export const generateDocument = (documentData: UserDocumentData): GeneratedDocument => {
  const sections: string[] = [];

  // כותרת ראשית
  sections.push(generateHeader(documentData));

  // פרטי ממנה ומיופה כוח
  sections.push(generateParticipantsInfo(documentData));

  // חלק א': עניינים רכושיים
  sections.push(generatePropertySection(documentData));

  // חלק ב': עניינים אישיים
  sections.push(generatePersonalSection(documentData));

  // חלק ג': עניינים רפואיים
  sections.push(generateMedicalSection(documentData));

  // סיום
  sections.push(generateFooter(documentData));

  const html = sections.join('\n\n');

  return {
    html,
    metadata: {
      generatedAt: new Date(),
      documentId: documentData.documentId,
      userName: documentData.userProfile.fullName,
      attorneyNames: documentData.attorneys.map(a => a.fullName)
    }
  };
};

/**
 * יוצר את הכותרת הראשית
 */
const generateHeader = (data: UserDocumentData): string => {
  return `
    <div class="document-header">
      <h1>הנחיות מקדימות בייפוי כוח מתמשך</h1>
      <h2>מסמך מספר: ${data.documentId}</h2>
      <p class="date">תאריך יצירה: ${new Date().toLocaleDateString('he-IL')}</p>
    </div>
  `;
};

/**
 * יוצר את פרטי הממנה ומיופי הכוח
 */
const generateParticipantsInfo = (data: UserDocumentData): string => {
  const { userProfile, attorneys } = data;

  let html = `
    <div class="participants-info">
      <h2>פרטי הממנה</h2>
      <table class="info-table">
        <tr><td><strong>שם מלא:</strong></td><td>${userProfile.fullName}</td></tr>
        <tr><td><strong>תעודת זהות:</strong></td><td>${userProfile.idNumber}</td></tr>
        <tr><td><strong>תאריך לידה:</strong></td><td>${userProfile.birthDate}</td></tr>
        <tr><td><strong>כתובת:</strong></td><td>${userProfile.address}</td></tr>
        <tr><td><strong>טלפון:</strong></td><td>${userProfile.phone}</td></tr>
        ${userProfile.email ? `<tr><td><strong>דוא"ל:</strong></td><td>${userProfile.email}</td></tr>` : ''}
        <tr><td><strong>קופת חולים:</strong></td><td>${getHealthFundName(userProfile.healthFund)}</td></tr>
      </table>

      <h2>מיופה/י כוח</h2>
  `;

  attorneys.forEach((attorney, index) => {
    html += `
      <h3>${attorney.isPrimary ? 'מיופה כוח ראשי' : `מיופה כוח מחליף ${index}`}</h3>
      <table class="info-table">
        <tr><td><strong>שם מלא:</strong></td><td>${attorney.fullName}</td></tr>
        <tr><td><strong>תעודת זהות:</strong></td><td>${attorney.idNumber}</td></tr>
        <tr><td><strong>יחס קרבה:</strong></td><td>${attorney.relationship}</td></tr>
        <tr><td><strong>כתובת:</strong></td><td>${attorney.address}</td></tr>
        <tr><td><strong>טלפון:</strong></td><td>${attorney.phone}</td></tr>
        ${attorney.email ? `<tr><td><strong>דוא"ל:</strong></td><td>${attorney.email}</td></tr>` : ''}
      </table>
    `;
  });

  html += '</div>';
  return html;
};

/**
 * יוצר את החלק הרכושי
 */
const generatePropertySection = (data: UserDocumentData): string => {
  return generateCategorySection(data, 'property', 'חלק א\': הנחיות בעניינים רכושיים');
};

/**
 * יוצר את החלק האישי
 */
const generatePersonalSection = (data: UserDocumentData): string => {
  return generateCategorySection(data, 'personal', 'חלק ב\': הנחיות לעניינים אישיים');
};

/**
 * יוצר את החלק הרפואי
 */
const generateMedicalSection = (data: UserDocumentData): string => {
  return generateCategorySection(data, 'medical', 'חלק ג\': הנחיות לעניינים רפואיים');
};

/**
 * יוצר קטגוריה שלמה (רכושי/אישי/רפואי)
 */
const generateCategorySection = (
  data: UserDocumentData,
  category: 'property' | 'personal' | 'medical',
  title: string
): string => {
  const categoryModules = data.selectedModules
    .map(id => ALL_MODULES[id])
    .filter(module => module && module.category === category);

  if (categoryModules.length === 0) {
    return '';
  }

  let html = `<div class="category-section ${category}">`;
  html += `<h1 class="category-title">${title}</h1>`;

  categoryModules.forEach(module => {
    html += generateModuleContent(module, data);
  });

  html += '</div>';
  return html;
};

/**
 * יוצר תוכן של מודול בודד
 */
const generateModuleContent = (module: Module, data: UserDocumentData): string => {
  const moduleData = data.moduleData[module.id];
  if (!moduleData) {
    return '';
  }

  let html = `<div class="module" id="${module.id}">`;
  html += `<h2 class="module-title">${module.nameHe}</h2>`;

  module.sections.forEach(section => {
    const sectionData = moduleData.sections[section.id];
    if (!sectionData) {
      return;
    }

    html += `<div class="section" id="${section.id}">`;
    html += `<h3 class="section-title">${section.nameHe}</h3>`;

    // מצא את הווריאנט הנבחר
    const selectedVariant = section.variants.find(v => v.id === sectionData.selectedVariantId);
    
    if (selectedVariant) {
      // צור context והרנדר את התבנית
      const context = createModuleContext(
        data.userProfile,
        moduleData,
        sectionData
      );

      const renderedText = renderTemplate(selectedVariant.textTemplate, context);
      html += `<div class="content">${renderedText}</div>`;
    }

    // טפל ב-subsections אם יש
    if (section.subsections && sectionData.subsections) {
      section.subsections.forEach(subsection => {
        const subsectionData = sectionData.subsections![subsection.id];
        if (!subsectionData) {
          return;
        }

        html += `<div class="subsection" id="${subsection.id}">`;
        html += `<h4 class="subsection-title">${subsection.nameHe}</h4>`;

        const selectedSubVariant = subsection.variants.find(
          v => v.id === subsectionData.selectedVariantId
        );

        if (selectedSubVariant) {
          const context = createModuleContext(
            data.userProfile,
            moduleData,
            subsectionData
          );

          const renderedText = renderTemplate(selectedSubVariant.textTemplate, context);
          html += `<div class="content">${renderedText}</div>`;
        }

        html += '</div>'; // subsection
      });
    }

    html += '</div>'; // section
  });

  html += '</div>'; // module
  return html;
};

/**
 * יוצר את הסיום
 */
const generateFooter = (data: UserDocumentData): string => {
  return `
    <div class="document-footer">
      <div class="signature-section">
        <h2>חתימות</h2>
        <div class="signature-block">
          <p><strong>הממנה:</strong></p>
          <p>שם: ${data.userProfile.fullName}</p>
          <p>תאריך: _________________</p>
          <p>חתימה: _________________</p>
        </div>

        ${data.attorneys.map((attorney, index) => `
          <div class="signature-block">
            <p><strong>${attorney.isPrimary ? 'מיופה כוח ראשי' : `מיופה כוח מחליף ${index}`}:</strong></p>
            <p>שם: ${attorney.fullName}</p>
            <p>תאריך: _________________</p>
            <p>חתימה: _________________</p>
          </div>
        `).join('\n')}

        <div class="signature-block">
          <p><strong>עורך דין מאשר:</strong></p>
          <p>שם: _________________</p>
          <p>מספר רישיון: _________________</p>
          <p>תאריך: _________________</p>
          <p>חתימה וחותמת: _________________</p>
        </div>
      </div>
    </div>
  `;
};

/**
 * פונקציות עזר
 */
const getHealthFundName = (code: string): string => {
  const names: Record<string, string> = {
    'clalit': 'כללית',
    'maccabi': 'מכבי',
    'meuhedet': 'מאוחדת',
    'leumit': 'לאומית'
  };
  return names[code] || code;
};

