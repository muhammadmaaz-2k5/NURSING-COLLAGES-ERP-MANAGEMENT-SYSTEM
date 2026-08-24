export type EmploymentStatus =
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'PROBATION'
  | 'TERMINATED'
  | 'RESIGNED';

export type LeaveType = 'CASUAL' | 'SICK' | 'ANNUAL' | 'MATERNITY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PayrollStatus =
  | 'DRAFT'
  | 'CALCULATED'
  | 'APPROVED'
  | 'PAID'
  | 'REVERSED';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  designation: string;
  departmentId?: string;
  departmentName?: string;
  qualification?: string;
  joiningDate: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  status: EmploymentStatus;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  netSalary?: number;
  leaveBalance?: {
    casual: number;
    sick: number;
    annual: number;
  };
}

export interface EmployeeLeave {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  avatarUrl?: string;
  departmentName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason?: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  departmentName: string;
  avatarUrl?: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  bonuses: number;
  taxDeduction: number;
  unpaidLeaveDeduction: number;
  netSalary: number;
  status: PayrollStatus;
  disbursedAt?: string;
  disbursedBy?: string;
  paymentMethod?: string;
  reversalReason?: string;
  createdAt: string;
}

export interface HrDashboardData {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  monthlyPayrollExpense: number;
  pendingLeavesCount: number;
  payrollProcessedThisMonth: boolean;
}

export interface CreateEmployeeDto {
  employeeId?: string;
  departmentId?: string;
  firstName: string;
  lastName?: string;
  designation: string;
  qualification?: string;
  joiningDate?: string;
  phone?: string;
  email?: string;
  basicSalary: number;
}

export interface ApplyLeaveDto {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ProcessPayrollDto {
  month: number;
  year: number;
}

export interface ReversePayrollDto {
  reason: string;
}
