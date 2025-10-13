import Link from 'next/link';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* לוגו ותיאור */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 text-white mb-4">
              <FileText className="w-6 h-6" />
              <span className="text-lg font-bold">תבניות משפטיות</span>
            </div>
            <p className="text-sm leading-relaxed">
              המערכת המקיפה ביותר לתבניות משפטיות בעברית. 
              כל מה שעורך דין צריך במקום אחד.
            </p>
          </div>

          {/* קישורים מהירים */}
          <div>
            <h3 className="text-white font-semibold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates" className="hover:text-white transition">
                  כל התבניות
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition">
                  קטגוריות
                </Link>
              </li>
              <li>
                <Link href="/editor" className="hover:text-white transition">
                  צור מסמך חדש
                </Link>
              </li>
              <li>
                <Link href="/my-documents" className="hover:text-white transition">
                  המסמכים שלי
                </Link>
              </li>
            </ul>
          </div>

          {/* קטגוריות פופולריות */}
          <div>
            <h3 className="text-white font-semibold mb-4">קטגוריות פופולריות</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates?category=beit-din" className="hover:text-white transition">
                  כתבי בית דין
                </Link>
              </li>
              <li>
                <Link href="/templates?category=wills" className="hover:text-white transition">
                  צוואות
                </Link>
              </li>
              <li>
                <Link href="/templates?category=power-of-attorney" className="hover:text-white transition">
                  ייפויי כוח
                </Link>
              </li>
              <li>
                <Link href="/templates?category=contracts" className="hover:text-white transition">
                  הסכמים
                </Link>
              </li>
            </ul>
          </div>

          {/* יצירת קשר */}
          <div>
            <h3 className="text-white font-semibold mb-4">יצירת קשר</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@legal-templates.co.il" className="hover:text-white transition">
                  info@legal-templates.co.il
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:03-1234567" className="hover:text-white transition">
                  03-1234567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>תל אביב, ישראל</span>
              </li>
            </ul>
          </div>
        </div>

        {/* מחיצה */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {currentYear} מערכת תבניות משפטיות. כל הזכויות שמורות.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-white transition">
                תנאי שימוש
              </Link>
              <Link href="/privacy" className="hover:text-white transition">
                מדיניות פרטיות
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                צור קשר
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
