import { SearchResult, QuickAction } from '../types/search.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function searchGlobal(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();

  // Integrated Institutional Entity Corpus
  const entityCorpus: SearchResult[] = [
    // Students
    { id: 's-01', title: 'Amina Bibi', subtitle: 'Roll # NUR-2022-0041 • Semester 5 BSN Generic', category: 'STUDENTS', url: '/students/stu-01', badge: 'STUDENT' },
    { id: 's-02', title: 'Hamza Malik', subtitle: 'Roll # NUR-2023-0089 • Semester 3 BSN Generic', category: 'STUDENTS', url: '/students/stu-02', badge: 'STUDENT' },
    { id: 's-03', title: 'Zainab Fatima', subtitle: 'Roll # NUR-2024-0102 • Semester 1 BSN Generic', category: 'STUDENTS', url: '/students/stu-03', badge: 'STUDENT' },

    // Faculty
    { id: 'f-01', title: 'Dr. Sarah Ahmed', subtitle: 'Associate Professor & HOD • Ph.D. Nursing', category: 'FACULTY', url: '/faculty/fac-01', badge: 'FACULTY' },
    { id: 'f-02', title: 'Muhammad Usman', subtitle: 'Senior Clinical Instructor • MSN Critical Care', category: 'FACULTY', url: '/faculty/fac-02', badge: 'FACULTY' },

    // Finance & Invoices
    { id: 'fin-01', title: 'Challan # INV-2026-1042', subtitle: 'Amina Bibi • PKR 65,000 (Tuition Fee)', category: 'FINANCE', url: '/finance', badge: 'PAID' },
    { id: 'fin-02', title: 'Challan # INV-2026-1043', subtitle: 'Hamza Malik • PKR 45,000 (Lab & Hostel)', category: 'FINANCE', url: '/finance', badge: 'PENDING' },

    // Hospital & EMR
    { id: 'hosp-01', title: 'Patient: Fatima Noor', subtitle: 'MRN-2026-088 • Ward 2A (Bed B-04) • Post-Op', category: 'HOSPITAL', url: '/hospital', badge: 'IPD ADMITTED' },
    { id: 'hosp-02', title: 'Ward 2A (Female Surgical Ward)', subtitle: '18 / 20 Beds Occupied (90%)', category: 'HOSPITAL', url: '/hospital', badge: 'WARD' },

    // Pharmacy
    { id: 'pharma-01', title: 'Ceftriaxone 1g IV Injection', subtitle: 'Formulary # MED-001 • 320 Vials in Stock', category: 'PHARMACY', url: '/pharmacy', badge: 'FORMULARY' },
    { id: 'pharma-02', title: 'Paracetamol 500mg Tablets', subtitle: 'Formulary # MED-002 • 1,500 Tablets in Stock', category: 'PHARMACY', url: '/pharmacy', badge: 'FORMULARY' },

    // Hostel
    { id: 'host-01', title: 'Florence Nightingale Hall', subtitle: 'Female Nursing Hostel • 48 / 50 Beds (96%)', category: 'HOSTEL', url: '/hostel', badge: 'HOSTEL' },
    { id: 'host-02', title: 'Room 201 (Triple Bed)', subtitle: 'Bed B-01 (Occupied), Bed B-02 (Free)', category: 'HOSTEL', url: '/hostel', badge: 'ROOM' },

    // Library
    { id: 'lib-01', title: 'Fundamentals of Nursing (10th Ed)', subtitle: 'ISBN: 978-0323677721 • 12 Copies Available', category: 'LIBRARY', url: '/library', badge: 'BOOK' },
    { id: 'lib-02', title: 'Brunner & Suddarth’s Medical-Surgical Nursing', subtitle: 'ISBN: 978-1496347992 • 8 Copies Available', category: 'LIBRARY', url: '/library', badge: 'BOOK' },

    // Transport
    { id: 'tr-01', title: 'Campus Coaster 01 (Bus # ICT-8921)', subtitle: 'Route 1: Rawalpindi Saddar Corridor (28/32 Seats)', category: 'TRANSPORT', url: '/transport', badge: 'VEHICLE' },

    // HR & Payroll
    { id: 'hr-01', title: 'Employee # EMP-2022-001 (Dr. Sarah Ahmed)', subtitle: 'Associate Professor • Net Salary: PKR 208,000', category: 'HR', url: '/hr', badge: 'EMPLOYEE' },
  ];

  return entityCorpus.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)),
  );
}

export function getQuickActions(): QuickAction[] {
  return [
    { id: 'qa-01', title: 'Collect Student Fee', description: 'Record challan payment with auto ledger balancing', url: '/finance', category: 'ACTIONS', shortcut: 'F' },
    { id: 'qa-02', title: 'Register New Student', description: 'Create 360° student profile with program enrollment', url: '/students', category: 'ACTIONS', shortcut: 'S' },
    { id: 'qa-03', title: 'Admit Hospital Patient', description: 'Register inpatient and assign ward bed matrix', url: '/hospital', category: 'ACTIONS', shortcut: 'H' },
    { id: 'qa-04', title: 'Dispense Medicine (FIFO)', description: 'Batch inventory dispensing counter', url: '/pharmacy/dispense', category: 'ACTIONS', shortcut: 'D' },
    { id: 'qa-05', title: 'Issue Library Book', description: 'Scan accession barcode for student loan', url: '/library', category: 'ACTIONS', shortcut: 'L' },
    { id: 'qa-06', title: 'Allocate Hostel Bed', description: 'Assign resident to single-occupant bed', url: '/hostel', category: 'ACTIONS', shortcut: 'B' },
    { id: 'qa-07', title: 'Run Deterministic Payroll', description: 'Calculate monthly faculty & staff compensation', url: '/hr/payroll', category: 'ACTIONS', shortcut: 'P' },
    { id: 'qa-08', title: 'Post Public Notice / Circular', description: 'Publish examination datesheet or clinical roster', url: '/portal/notices', category: 'ACTIONS', shortcut: 'N' },
  ];
}
