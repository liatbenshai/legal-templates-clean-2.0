import { DocumentStructure, ContentBlock, TableContent, ListContent, TextStyle } from './editor-types';

/**
 * ממיר מסמך מובנה ל-HTML מעוצב
 */
export function renderDocumentToHTML(document: DocumentStructure, data?: Record<string, any>): string {
  const { blocks, pageSettings, styles } = document;
  
  let html = `
<!DOCTYPE html>
<html dir="${styles.direction}" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.title}</title>
  <style>
    @page {
      size: ${pageSettings.size} ${pageSettings.orientation};
      margin: ${pageSettings.margins.top}cm ${pageSettings.margins.right}cm ${pageSettings.margins.bottom}cm ${pageSettings.margins.left}cm;
    }
    
    body {
      font-family: ${styles.defaultFont};
      font-size: ${styles.defaultFontSize}pt;
      line-height: ${styles.defaultLineHeight};
      direction: ${styles.direction};
      margin: 0;
      padding: 20px;
    }
    
    .document-container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 20px;
    }
    
    h1 { ${styleToCSS(styles.heading1)} margin-top: 0; }
    h2 { ${styleToCSS(styles.heading2)} }
    h3 { ${styleToCSS(styles.heading3)} }
    h4 { ${styleToCSS(styles.heading4)} }
    p { ${styleToCSS(styles.paragraph)} }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    table td, table th {
      padding: 8px;
      border: 1px solid #000;
    }
    
    table th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    
    .horizontal-rule {
      border: none;
      border-top: 2px solid #000;
      margin: 20px 0;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    .signature-block {
      margin-top: 40px;
      white-space: pre-line;
    }
    
    ul, ol {
      margin: 10px 0;
      padding-right: 30px;
    }
    
    .indent-1 { padding-right: 20px; }
    .indent-2 { padding-right: 40px; }
    .indent-3 { padding-right: 60px; }
    .indent-4 { padding-right: 80px; }
    .indent-5 { padding-right: 100px; }
    
    @media print {
      .document-container {
        padding: 0;
      }
      
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="document-container">
`;

  blocks.forEach(block => {
    html += renderBlock(block, data);
  });
  
  html += `
  </div>
</body>
</html>
`;

  return html;
}

/**
 * ממיר בלוק בודד ל-HTML
 */
function renderBlock(block: ContentBlock, data?: Record<string, any>): string {
  let content = typeof block.content === 'string' ? block.content : '';
  
  // החלפת משתנים
  if (data && typeof content === 'string') {
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(placeholder, data[key] || '');
    });
  }
  
  const styleAttr = block.style ? `style="${styleToCSS(block.style)}"` : '';
  const indentClass = block.metadata?.indent ? `class="indent-${block.metadata.indent}"` : '';
  const marginStyle = getMarginStyle(block);
  
  switch (block.type) {
    case 'heading1':
      return `<h1 ${styleAttr} ${marginStyle}>${content}</h1>\n`;
    
    case 'heading2':
      return `<h2 ${styleAttr} ${marginStyle}>${content}</h2>\n`;
    
    case 'heading3':
      return `<h3 ${styleAttr} ${marginStyle}>${content}</h3>\n`;
    
    case 'heading4':
      return `<h4 ${styleAttr} ${marginStyle}>${content}</h4>\n`;
    
    case 'paragraph':
    case 'legal-section':
      return `<p ${styleAttr} ${indentClass} ${marginStyle}>${content}</p>\n`;
    
    case 'horizontal-rule':
      return `<hr class="horizontal-rule" ${marginStyle}>\n`;
    
    case 'page-break':
      return `<div class="page-break"></div>\n`;
    
    case 'signature-block':
      return `<div class="signature-block" ${styleAttr}>${content}</div>\n`;
    
    case 'table':
      return renderTable(block.content as TableContent, block.metadata);
    
    case 'numbered-list':
    case 'bullet-list':
      return renderList(block);
    
    case 'blockquote':
      return `<blockquote ${styleAttr} ${marginStyle}>${content}</blockquote>\n`;
    
    default:
      return `<div ${styleAttr}>${content}</div>\n`;
  }
}

/**
 * ממיר טבלה ל-HTML
 */
function renderTable(table: TableContent, metadata?: any): string {
  const borderStyle = table.borderStyle || 'solid';
  const borderWidth = table.borderWidth || 1;
  const borderColor = table.borderColor || '#000';
  
  let html = `<table style="border: ${borderWidth}px ${borderStyle} ${borderColor};">\n`;
  
  table.rows.forEach((row, rowIndex) => {
    const isHeader = row.isHeader || (table.headerRow && rowIndex === 0);
    const tag = isHeader ? 'th' : 'td';
    
    html += '  <tr>\n';
    row.cells.forEach(cell => {
      const cellStyle = cell.style ? styleToCSS(cell.style) : '';
      const bgColor = cell.backgroundColor ? `background-color: ${cell.backgroundColor};` : '';
      const colspan = cell.colspan ? `colspan="${cell.colspan}"` : '';
      const rowspan = cell.rowspan ? `rowspan="${cell.rowspan}"` : '';
      const vAlign = cell.verticalAlign ? `vertical-align: ${cell.verticalAlign};` : '';
      
      html += `    <${tag} style="${cellStyle}${bgColor}${vAlign}" ${colspan} ${rowspan}>${cell.content}</${tag}>\n`;
    });
    html += '  </tr>\n';
  });
  
  html += '</table>\n';
  return html;
}

/**
 * ממיר רשימה ל-HTML
 */
function renderList(block: ContentBlock): string {
  const listContent = block.content as ListContent;
  const tag = block.type === 'numbered-list' ? 'ol' : 'ul';
  const listStyle = block.metadata?.listStyle || '';
  const styleAttr = listStyle ? `style="list-style-type: ${listStyle};"` : '';
  
  let html = `<${tag} ${styleAttr}>\n`;
  
  listContent.items.forEach(item => {
    const itemStyle = item.style ? `style="${styleToCSS(item.style)}"` : '';
    html += `  <li ${itemStyle}>${item.content}</li>\n`;
    
    if (item.children && item.children.length > 0) {
      html += renderNestedList(item.children, tag);
    }
  });
  
  html += `</${tag}>\n`;
  return html;
}

/**
 * ממיר רשימה מקוננת
 */
function renderNestedList(items: any[], tag: string): string {
  let html = `<${tag}>\n`;
  items.forEach(item => {
    html += `  <li>${item.content}</li>\n`;
    if (item.children) {
      html += renderNestedList(item.children, tag);
    }
  });
  html += `</${tag}>\n`;
  return html;
}

/**
 * ממיר סגנון ל-CSS
 */
function styleToCSS(style: TextStyle): string {
  let css = '';
  
  if (style.bold) css += 'font-weight: bold; ';
  if (style.italic) css += 'font-style: italic; ';
  if (style.underline) css += 'text-decoration: underline; ';
  if (style.strikethrough) css += 'text-decoration: line-through; ';
  if (style.fontSize) css += `font-size: ${style.fontSize}pt; `;
  if (style.fontFamily) css += `font-family: ${style.fontFamily}; `;
  if (style.color) css += `color: ${style.color}; `;
  if (style.backgroundColor) css += `background-color: ${style.backgroundColor}; `;
  if (style.textAlign) css += `text-align: ${style.textAlign}; `;
  if (style.lineHeight) css += `line-height: ${style.lineHeight}; `;
  if (style.letterSpacing) css += `letter-spacing: ${style.letterSpacing}px; `;
  
  return css;
}

/**
 * מחזיר סגנון margin
 */
function getMarginStyle(block: ContentBlock): string {
  if (!block.metadata) return '';
  
  let style = 'style="';
  if (block.metadata.marginTop) style += `margin-top: ${block.metadata.marginTop}px; `;
  if (block.metadata.marginBottom) style += `margin-bottom: ${block.metadata.marginBottom}px; `;
  style += '"';
  
  return block.metadata.marginTop || block.metadata.marginBottom ? style : '';
}

/**
 * ייצוא מסמך ל-PDF (דורש ספרייה חיצונית)
 */
export async function exportToPDF(document: DocumentStructure, data?: Record<string, any>): Promise<Blob> {
  const html = renderDocumentToHTML(document, data);
  
  // כאן נצטרך להשתמש בספרייה כמו html2pdf או puppeteer
  // לעת עתה מחזיר HTML כ-Blob
  return new Blob([html], { type: 'text/html' });
}

/**
 * ייצוא מסמך ל-DOCX
 */
export async function exportToDocx(document: DocumentStructure, data?: Record<string, any>): Promise<Blob> {
  // יידרש שימוש בספרייה כמו docx או html-docx-js
  // לעת עתה placeholder
  const html = renderDocumentToHTML(document, data);
  return new Blob([html], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

