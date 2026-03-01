import { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-8">{children}</main>
      <Footer />
    </div>
  );
}
