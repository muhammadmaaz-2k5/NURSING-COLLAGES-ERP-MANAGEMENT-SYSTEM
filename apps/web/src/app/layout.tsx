import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'PERN Multi-College Monolith ERP',
  description: 'Enterprise Multi-College ERP & SaaS Platform built with NestJS, Next.js, and Prisma ORM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-wrapper">
            <Navbar />
            <main className="content-body">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
