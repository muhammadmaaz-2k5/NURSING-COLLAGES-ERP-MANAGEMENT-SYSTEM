export type IssueStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST' | 'DAMAGED';
export type BookCopyStatus = 'AVAILABLE' | 'ISSUED' | 'MAINTENANCE' | 'LOST' | 'DAMAGED';

export interface BookCopy {
  id: string;
  bookId: string;
  accessionNo: string;
  barcode?: string;
  shelfLocation?: string;
  condition?: string;
  status: BookCopyStatus;
  currentIssue?: {
    id: string;
    studentId: string;
    studentName: string;
    studentRegId: string;
    avatarUrl?: string;
    issuedAt: string;
    dueDate: string;
    isOverdue?: boolean;
    daysOverdue?: number;
    fineAmount?: number;
  };
}

export interface BookTitle {
  id: string;
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  category?: string;
  edition?: string;
  shelfLocation?: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  copies?: BookCopy[];
}

export interface CirculationIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  isbn?: string;
  copyId: string;
  accessionNo: string;
  studentId: string;
  studentName: string;
  studentRegId: string;
  avatarUrl?: string;
  programName?: string;
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: IssueStatus;
  isOverdue?: boolean;
  daysOverdue?: number;
  fineAmount?: number;
  finePaid?: boolean;
}

export interface LibraryDashboardData {
  totalTitles: number;
  totalVolumes: number;
  availableCopies: number;
  activeIssuesCount: number;
  overdueIssuesCount: number;
  totalFinesCollected: number;
}

export interface CreateBookDto {
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  category?: string;
  edition?: string;
  copiesCount?: number;
}

export interface AddBookCopyDto {
  bookId: string;
  accessionNo: string;
  condition?: string;
  shelfLocation?: string;
}

export interface IssueBookDto {
  bookId: string;
  copyId?: string;
  studentId: string;
  dueDays?: number;
}

export interface ReturnBookDto {
  condition?: string;
  fineAmount?: number;
  waiveFine?: boolean;
}
