import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ModuleProvider } from '../context/ModuleContext';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AppShell } from '../components/layout/AppShell';

export const metadata: Metadata = {
  title: 'PERN Multi-College Nursing ERP & Clinical Management System',
  description:
    'Complete Production-Grade Nursing College ERP with Hospital OPD/IPD, Pharmacy FIFO, Hostel, Library, Transport, and HR Payroll',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white font-sans min-h-screen transition-colors duration-150">
        <ThemeProvider>
          <AuthProvider>
            <ModuleProvider>
              <ToastProvider>
                <AppShell>{children}</AppShell>
              </ToastProvider>
            </ModuleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
