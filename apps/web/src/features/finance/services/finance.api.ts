import {
  FeeStructure,
  InvoiceItem,
  InvoiceDetail,
  Scholarship,
  StudentFinancialStatement,
  FinancialSummaryData,
  CreateFeeStructureDto,
  GenerateInvoiceDto,
  RecordPaymentDto,
  CreateScholarshipDto,
  PaymentStatus,
} from '../types/finance.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchFeeStructures(): Promise<FeeStructure[]> {
  try {
    const res = await fetch(`${API_BASE}/finance/structures`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch fee structures');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'fs-01',
        name: 'Generic BSN — Semester 1 Tuition & Lab Fee',
        feeType: 'TUITION',
        amount: 85000,
        dueDate: '2026-09-10',
        isActive: true,
        program: { id: 'prog-01', name: 'Generic BSN', code: 'BSN-GEN' },
      },
      {
        id: 'fs-02',
        name: 'Clinical Ward Practicum & Hospital Training Fee',
        feeType: 'CLINICAL_TRAINING',
        amount: 25000,
        dueDate: '2026-09-15',
        isActive: true,
        program: { id: 'prog-01', name: 'Generic BSN', code: 'BSN-GEN' },
      },
      {
        id: 'fs-03',
        name: 'Annual Nursing Skills & Simulation Lab Consumables',
        feeType: 'LABORATORY',
        amount: 15000,
        dueDate: '2026-09-10',
        isActive: true,
        program: { id: 'prog-01', name: 'Generic BSN', code: 'BSN-GEN' },
      },
      {
        id: 'fs-04',
        name: 'Post-RN BSN — Semester Tuition Fee',
        feeType: 'TUITION',
        amount: 65000,
        dueDate: '2026-09-10',
        isActive: true,
        program: { id: 'prog-02', name: 'Post-RN BSN', code: 'POST-RN' },
      },
    ];
  }
}

export async function fetchInvoices(params?: {
  studentId?: string;
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}): Promise<{ data: InvoiceItem[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/finance/invoices?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    const json = await res.json();
    if (Array.isArray(json)) return { data: json, total: json.length };
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch {
    return {
      data: [
        {
          id: 'inv-01',
          challanNumber: 'CH-2026-089',
          studentId: 'stud-01',
          studentName: 'Amina Bibi',
          studentRegId: 'NUR-2022-0041',
          programName: 'Generic BSN',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          feeStructureName: 'Generic BSN — Semester 6 Tuition & Clinical Fee',
          feeType: 'TUITION',
          grossAmount: 85000,
          scholarshipAmount: 15000,
          netAmount: 70000,
          paidAmount: 70000,
          remainingAmount: 0,
          dueDate: '2026-09-10',
          status: 'PAID',
          createdAt: '2026-08-01',
        },
        {
          id: 'inv-02',
          challanNumber: 'CH-2026-090',
          studentId: 'stud-02',
          studentName: 'Bilal Khan',
          studentRegId: 'NUR-2022-0089',
          programName: 'Generic BSN',
          avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
          feeStructureName: 'Generic BSN — Semester 6 Tuition & Clinical Fee',
          feeType: 'TUITION',
          grossAmount: 85000,
          scholarshipAmount: 0,
          netAmount: 85000,
          paidAmount: 40000,
          remainingAmount: 45000,
          dueDate: '2026-09-10',
          status: 'PARTIAL',
          createdAt: '2026-08-01',
        },
        {
          id: 'inv-03',
          challanNumber: 'CH-2026-091',
          studentId: 'stud-03',
          studentName: 'Farah Naz',
          studentRegId: 'NUR-2023-0104',
          programName: 'Post-RN BSN',
          avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150',
          feeStructureName: 'Post-RN BSN — Semester 3 Tuition Fee',
          feeType: 'TUITION',
          grossAmount: 65000,
          scholarshipAmount: 0,
          netAmount: 65000,
          paidAmount: 0,
          remainingAmount: 65000,
          dueDate: '2026-09-10',
          status: 'UNPAID',
          createdAt: '2026-08-01',
        },
      ],
      total: 3,
    };
  }
}

export async function fetchInvoiceById(id: string): Promise<InvoiceDetail> {
  try {
    const res = await fetch(`${API_BASE}/finance/invoices/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Invoice not found');
    return await res.json();
  } catch {
    return {
      id: id || 'inv-02',
      challanNumber: 'CH-2026-090',
      studentId: 'stud-02',
      studentName: 'Bilal Khan',
      studentRegId: 'NUR-2022-0089',
      programName: 'Bachelor of Science in Nursing (Generic 4-Year)',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      feeStructureName: 'Generic BSN — Semester 6 Tuition & Clinical Fee',
      feeType: 'TUITION',
      grossAmount: 85000,
      scholarshipAmount: 0,
      netAmount: 85000,
      paidAmount: 40000,
      remainingAmount: 45000,
      dueDate: '2026-09-10',
      status: 'PARTIAL',
      createdAt: '2026-08-01',
      payments: [
        {
          id: 'pay-01',
          amount: 40000,
          method: 'BANK_TRANSFER',
          transactionId: 'HBL-FT-9988776655',
          paidAt: '2026-08-05 11:30 AM',
          notes: 'First installment cleared via HBL Online Deposit',
        },
      ],
    };
  }
}

export async function fetchScholarships(): Promise<Scholarship[]> {
  try {
    const res = await fetch(`${API_BASE}/finance/scholarships`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch scholarships');
    return await res.json();
  } catch {
    return [
      {
        id: 'sch-01',
        name: 'PNC Nursing Merit Excellence Concession',
        type: 'MERIT',
        percentage: 50,
        description: '50% tuition waiver for semester top performers with CGPA >= 3.80',
        isActive: true,
        _count: { studentScholarships: 12 },
      },
      {
        id: 'sch-02',
        name: 'Shaheed Healthcare Workers Financial Need Grant',
        type: 'NEED_BASED',
        fixedAmount: 40000,
        description: 'Fixed Rs. 40,000 semester grant for deserving candidates',
        isActive: true,
        _count: { studentScholarships: 18 },
      },
    ];
  }
}

export async function fetchStudentFinancialStatement(
  studentId: string,
): Promise<StudentFinancialStatement> {
  try {
    const res = await fetch(`${API_BASE}/finance/students/${studentId}/statement`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Statement not found');
    return await res.json();
  } catch {
    return {
      studentId: studentId || 'stud-01',
      studentName: 'Amina Bibi',
      regId: 'NUR-2022-0041',
      programName: 'Bachelor of Science in Nursing (Generic 4-Year)',
      totalBilled: 320000,
      totalScholarships: 40000,
      totalPaid: 260000,
      outstandingBalance: 20000,
      ledger: [
        { id: 'tx-01', date: '2026-08-01', type: 'INVOICE', description: 'Semester 6 Tuition & Clinical Fee', challanNumber: 'CH-2026-089', debit: 85000, credit: 0, balance: 85000, status: 'PAID' },
        { id: 'tx-02', date: '2026-08-02', type: 'SCHOLARSHIP', description: 'PNC Merit Concession Applied', debit: 0, credit: 15000, balance: 70000, status: 'PAID' },
        { id: 'tx-03', date: '2026-08-05', type: 'PAYMENT', description: 'Bank Online Payment (HBL-FT-112233)', challanNumber: 'CH-2026-089', debit: 0, credit: 70000, balance: 0, status: 'PAID' },
        { id: 'tx-04', date: '2026-08-15', type: 'INVOICE', description: 'Midterm Examination Fee', challanNumber: 'CH-2026-142', debit: 20000, credit: 0, balance: 20000, status: 'UNPAID' },
      ],
    };
  }
}

export async function createFeeStructure(dto: CreateFeeStructureDto) {
  const res = await fetch(`${API_BASE}/finance/structures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create fee structure');
  }

  return await res.json();
}

export async function generateInvoice(dto: GenerateInvoiceDto) {
  const res = await fetch(`${API_BASE}/finance/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to generate invoice challan');
  }

  return await res.json();
}

export async function recordPayment(dto: RecordPaymentDto) {
  const res = await fetch(`${API_BASE}/finance/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Payment recording failed');
  }

  return await res.json();
}

export async function reversePayment(invoiceId: string, reason: string) {
  const res = await fetch(`${API_BASE}/finance/invoices/${invoiceId}/reverse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Payment reversal failed');
  }

  return await res.json();
}

export async function createScholarship(dto: CreateScholarshipDto) {
  const res = await fetch(`${API_BASE}/finance/scholarships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create scholarship');
  }

  return await res.json();
}

