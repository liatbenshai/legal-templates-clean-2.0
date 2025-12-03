'use client';

import Link from 'next/link';
import { FileText, Scale, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-12">
      {/* Glass overlay background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/95 to-slate-900/98 backdrop-blur-xl" />

      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl -top-32 -right-32" />
        <div className="absolute w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -bottom-24 -left-24" />
      </div>

      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 text-white mb-6">
                <div className="p-3 glass rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">מערכת תבניות משפטיות</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                המערכת המקיפה ביותר לתבניות משפטיות בעברית - כל מה שעורך דין צריך במקום אחד
              </p>
              {/* Social placeholder */}
              <div className="flex gap-3">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary-400" />
                קישורים מהירים
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    href="/documents"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                    מסמכים משפטיים
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                    תבניות
                  </Link>
                </li>
                <li>
                  <Link
                    href="/editor"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                    עורך מסמכים
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                    הפרופיל שלי
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Info */}
            <div>
              <h3 className="text-white font-bold mb-6">מידע משפטי</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform" />
                    תנאי שימוש
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform" />
                    מדיניות פרטיות
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform" />
                    אודות
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-6">צור קשר</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>info@legal-templates.co.il</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span dir="ltr">03-1234567</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>תל אביב, ישראל</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-slate-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} מערכת תבניות משפטיות. כל הזכויות שמורות.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>נבנה עם</span>
                <span className="text-red-400">❤</span>
                <span>לקהילת עורכי הדין בישראל</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
