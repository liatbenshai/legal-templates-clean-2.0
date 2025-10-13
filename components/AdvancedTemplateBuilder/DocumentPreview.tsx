'use client';

import { DocumentStructure } from '@/lib/editor-types';
import { renderDocumentToHTML } from '@/lib/document-renderer';
import { Download, Printer, Eye } from 'lucide-react';
import { useState } from 'react';

interface DocumentPreviewProps {
  document: DocumentStructure;
  data?: Record<string, any>;
  onExport?: (format: 'pdf' | 'docx' | 'html') => void;
}

export default function DocumentPreview({ 
  document, 
  data = {},
  onExport 
}: DocumentPreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const html = renderDocumentToHTML(document, data);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* כלי עבודה */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">תצוגה מקדימה</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* מצב תצוגה */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                previewMode === 'desktop'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              דסקטופ
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                previewMode === 'mobile'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              מובייל
            </button>
          </div>

          {/* הדפסה */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <Printer className="w-4 h-4" />
            <span>הדפס</span>
          </button>

          {/* ייצוא */}
          {onExport && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                <Download className="w-4 h-4" />
                <span>ייצא</span>
              </button>
              
              {/* תפריט ייצוא */}
              <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => onExport('pdf')}
                  className="w-full px-4 py-2 text-right text-gray-700 hover:bg-gray-100 transition"
                >
                  PDF
                </button>
                <button
                  onClick={() => onExport('docx')}
                  className="w-full px-4 py-2 text-right text-gray-700 hover:bg-gray-100 transition"
                >
                  Word (DOCX)
                </button>
                <button
                  onClick={() => onExport('html')}
                  className="w-full px-4 py-2 text-right text-gray-700 hover:bg-gray-100 transition"
                >
                  HTML
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* תצוגה מקדימה */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <div 
          className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${
            previewMode === 'desktop' 
              ? 'max-w-[210mm]' 
              : 'max-w-[375px]'
          }`}
          style={{
            minHeight: previewMode === 'desktop' ? '297mm' : 'auto',
          }}
        >
          <iframe
            srcDoc={html}
            className="w-full h-full border-0"
            style={{ minHeight: '800px' }}
            title="document-preview"
          />
        </div>
      </div>
    </div>
  );
}

