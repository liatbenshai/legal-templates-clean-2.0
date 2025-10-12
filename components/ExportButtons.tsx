'use client';

import { useState } from 'react';
import { FileDown, FileText, Printer, File } from 'lucide-react';
import { exportToPDF, exportToWord, printPreview } from '@/lib/document-export';

interface ExportButtonsProps {
  templateData: any;
  fieldValues: any;
  className?: string;
}

export default function ExportButtons({ templateData, fieldValues, className = '' }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'word' | 'print') => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      let result;
      
      switch (format) {
        case 'pdf':
          result = await exportToPDF(templateData, fieldValues);
          if (result.success) {
            setExportStatus(`✅ הקובץ ${result.fileName} הורד בהצלחה`);
          } else {
            setExportStatus(`❌ ${result.error}`);
          }
          break;
          
        case 'word':
          result = await exportToWord(templateData, fieldValues);
          if (result.success) {
            setExportStatus(`✅ הקובץ ${result.fileName} הורד בהצלחה`);
          } else {
            setExportStatus(`❌ ${result.error}`);
          }
          break;
          
        case 'print':
          printPreview(templateData, fieldValues);
          setExportStatus('✅ נפתח חלון הדפסה');
          break;
      }
    } catch (error: any) {
      console.error('שגיאה בייצוא:', error);
      setExportStatus(`❌ שגיאה: ${error.message}`);
    } finally {
      setIsExporting(false);
      
      // ניקוי הודעת סטטוס אחרי 5 שניות
      setTimeout(() => setExportStatus(null), 5000);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <FileDown className="w-5 h-5" />
          ייצוא מסמך
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* כפתור PDF */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-md hover:shadow-lg"
            title="ייצוא ל-PDF עם תמיכה מלאה בעברית RTL"
          >
            <File className="w-5 h-5" />
            <span>ייצא ל-PDF</span>
          </button>

          {/* כפתור Word */}
          <button
            onClick={() => handleExport('word')}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-md hover:shadow-lg"
            title="ייצוא ל-Word (DOCX) עם תמיכה מלאה בעברית RTL"
          >
            <FileText className="w-5 h-5" />
            <span>ייצא ל-Word</span>
          </button>

          {/* כפתור הדפסה */}
          <button
            onClick={() => handleExport('print')}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-md hover:shadow-lg"
            title="פתיחת תצוגת הדפסה"
          >
            <Printer className="w-5 h-5" />
            <span>הדפס</span>
          </button>
        </div>

        {/* הודעת סטטוס */}
        {exportStatus && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            exportStatus.startsWith('✅') 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {exportStatus}
          </div>
        )}

        {/* מידע נוסף */}
        <div className="mt-4 text-xs text-blue-700 space-y-1">
          <p>• כל הפורמטים תומכים באופן מלא בעברית וכיוון RTL</p>
          <p>• הפלייסהולדרים {'({{שם_שדה}})'} יוחלפו אוטומטית בערכים שמילאת</p>
          <p>• ההגדרות של העמוד (שוליים, פונט, גודל) ישמרו בקובץ המיוצא</p>
        </div>
      </div>

      {isExporting && (
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>מייצא מסמך...</span>
        </div>
      )}
    </div>
  );
}
