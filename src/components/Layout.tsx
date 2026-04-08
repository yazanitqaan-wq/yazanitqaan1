import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary flex flex-col" dir="rtl">
      <Navbar />
      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-500">
        {children}
      </main>
      <footer className="py-12 border-t mt-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-2 items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">Y</span>
            </div>
            <span className="font-serif font-bold text-xl">أكاديمية يزن أبو كحيل</span>
          </div>
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} جميع الحقوق محفوظة. صمم بكل حب للطلاب المتميزين.</p>
        </div>
      </footer>
    </div>
  );
}
