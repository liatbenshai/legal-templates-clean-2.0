import { UserDocumentData, GeneratedDocument } from '@/types/advanceDirectives.types';
import { ALL_MODULES } from '@/data/modules';

export function generateDocument(data: UserDocumentData): GeneratedDocument {
  const { userProfile, attorneys, selectedModules } = data;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <title>הנחיות מקדימות - ${userProfile.fullName}</title>
      <style>
        body { font-family: 'David Libre', serif; font-size: 14pt; line-height: 1.8; padding: 20px; }
        h1 { text-align: center; color: #1a202c; margin-bottom: 30px; }
        h2 { color: #2d3748; border-bottom: 2px solid #cbd5e0; padding-bottom: 10px; margin-top: 40px; }
        h3 { color: #4a5568; margin-top: 30px; }
        .info-section { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .category-property { border-right: 4px solid #27ae60; }
        .category-personal { border-right: 4px solid #3498db; }
        .category-medical { border-right: 4px solid #e74c3c; }
      </style>
    </head>
    <body>
      <h1>הנחיות מקדימות בייפוי כוח מתמשך</h1>
      
      <div class="info-section">
        <h2>פרטי הממנה</h2>
        <p><strong>שם מלא:</strong> ${userProfile.fullName}</p>
        <p><strong>ת.ז:</strong> ${userProfile.idNumber}</p>
        <p><strong>כתובת:</strong> ${userProfile.address}</p>
        <p><strong>טלפון:</strong> ${userProfile.phone}</p>
      </div>

      <div class="info-section">
        <h2>מיופי כוח</h2>
        ${attorneys.map((att, idx) => `
          <h3>${att.isPrimary ? 'מיופה כוח ראשי' : `מיופה כוח מחליף ${idx}`}</h3>
          <p><strong>שם:</strong> ${att.fullName}</p>
          <p><strong>ת.ז:</strong> ${att.idNumber}</p>
          <p><strong>יחס קרבה:</strong> ${att.relationship}</p>
          <p><strong>טלפון:</strong> ${att.phone}</p>
        `).join('')}
      </div>

      <h2 class="category-property">חלק א': עניינים רכושיים</h2>
      ${generateCategoryContent(selectedModules, 'property')}

      <h2 class="category-personal">חלק ב': עניינים אישיים</h2>
      ${generateCategoryContent(selectedModules, 'personal')}

      <h2 class="category-medical">חלק ג': עניינים רפואיים</h2>
      ${generateCategoryContent(selectedModules, 'medical')}

      <div style="margin-top: 60px; border-top: 2px solid #000; padding-top: 20px;">
        <p style="text-align: center;">
          <strong>חתימת הממנה:</strong> _____________________ <strong>תאריך:</strong> _____________
        </p>
        <p style="text-align: center; margin-top: 40px;">
          <strong>חתימת מיופה הכוח:</strong> _____________________ <strong>תאריך:</strong> _____________
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    documentId: data.documentId,
    html,
    metadata: {
      modulesCount: selectedModules.length,
      sectionsCount: 0,
      generatedAt: new Date()
    }
  };
}

function generateCategoryContent(selectedModules: string[], category: string): string {
  const modules = selectedModules
    .map(id => ALL_MODULES[id])
    .filter(m => m && m.category === category);

  return modules.map(module => `
    <div class="module">
      <h3>${module.nameHe}</h3>
      <p>${module.description || ''}</p>
    </div>
  `).join('');
}

