export type FeeType =
  | 'TUITION'
  | 'ADMISSION'
  | 'EXAMINATION'
  | 'HOSTEL'
  | 'TRANSPORT'
  | 'LABORATORY'
  | 'CLINICAL_TRAINING'
  | 'LIBRARY'
  | 'OTHER';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHEQUE' | 'ONLINE';
export type ScholarshipType = 'MERIT' | 'NEED_BASED' | 'FACULTY_WARD' | 'SPORTS' | 'GOVERNMENT' | 'DISABILITY';

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  feeType: FeeType;
  dueDate?: string;
  isActive: boolean;
  program?: {
    id: string;
    name: string;
    code: string;
  };
  semester?: {
    id: string;
    name: string;
  };
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  paidAt: string;
  notes?: string;
  isReversed?: boolean;
}

export interface InvoiceItem {
  id: string;
  challanNumber: string;
  studentId: string;
  studentName: string;
  studentRegId: string;
  programName: string;
  avatarUrl?: string;
  feeStructureName: string;
  feeType: FeeType;
  grossAmount: number;
  scholarshipAmount: number;
  netAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface InvoiceDetail extends InvoiceItem {
  payments: PaymentRecord[];
}

export interface Scholarship {
  id: string;
  name: string;
  type: ScholarshipType;
  percentage?: number;
  fixedAmount?: number;
  description?: string;
  isActive: boolean;
  _count?: {
    studentScholarships: number;
  };
}

export interface LedgerTransaction {
  id: string;
  date: string;
  type: 'INVOICE' | 'PAYMENT' | 'SCHOLARSHIP' | 'REFUND';
  description: string;
  challanNumber?: string;
  debit: number;
  credit: number;
  balance: number;
  status: PaymentStatus;
}

export interface StudentFinancialStatement {
  studentId: string;
  studentName: string;
  regId: string;
  programName: string;
  totalBilled: number;
  totalScholarships: number;
  totalPaid: number;
  outstandingBalance: number;
  ledger: LedgerTransaction[];
}

export interface FinancialSummaryData {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  overdueInvoicesCount: number;
  paidInvoicesCount: number;
  unpaidInvoicesCount: number;
}

export interface CreateFeeStructureDto {
  programId: string;
  semesterId?: string;
  name: string;
  description?: string;
  amount: number;
  feeType: FeeType;
  dueDate?: string;
}

export interface GenerateInvoiceDto {
  studentId: string;
  feeStructureId: string;
  customAmount?: number;
  dueDate?: string;
  notes?: string;
}

export interface RecordPaymentDto {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface CreateScholarshipDto {
  name: string;
  type: ScholarshipType;
  percentage?: number;
  fixedAmount?: number;
  description?: string;
}
