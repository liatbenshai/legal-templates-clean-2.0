import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'מערכת תבניות משפטיות',
  description: 'המערכת המקיפה ביותר לתבניות משפטיות בעברית - כל מה שעורך דין צריך במקום אחד',
  keywords: 'תבניות משפטיות, כתבי בית דין, צוואות, ייפויי כוח, הסכמים, עורך דין',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
