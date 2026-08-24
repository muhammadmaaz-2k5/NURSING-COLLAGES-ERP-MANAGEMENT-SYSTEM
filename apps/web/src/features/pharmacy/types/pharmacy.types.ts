export type MedicineMovementType =
  | 'PURCHASE'
  | 'DISPENSE'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'EXPIRED_WRITE_OFF'
  | 'RETURN';

export interface MedicineBatch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  notes?: string;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  daysUntilExpiry?: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  strength?: string;
  dosageForm?: string;
  manufacturer?: string;
  unit?: string;
  reorderLevel: number;
  totalStock: number;
  purchasePrice: number;
  sellingPrice: number;
  isLowStock?: boolean;
  batches?: MedicineBatch[];
}

export interface StockMovement {
  id: string;
  medicineId: string;
  medicineName: string;
  batchNumber?: string;
  type: MedicineMovementType;
  quantity: number;
  balanceAfter: number;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface MedicineDetail extends Medicine {
  batches: MedicineBatch[];
  movements: StockMovement[];
}

export interface PharmacyOverviewData {
  totalMedicines: number;
  totalStockUnits: number;
  totalStockValue: number;
  lowStockCount: number;
  expiringBatchesCount: number;
  dispensedTodayCount: number;
}

export interface CreateMedicineDto {
  name: string;
  genericName?: string;
  category?: string;
  strength?: string;
  dosageForm?: string;
  manufacturer?: string;
  unit?: string;
  reorderLevel?: number;
  purchasePrice?: number;
  sellingPrice?: number;
}

export interface AddStockBatchDto {
  medicineId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  notes?: string;
}

export interface DispenseItemDto {
  medicineId: string;
  batchId?: string;
  quantity: number;
  unitPrice?: number;
}

export interface DispensePrescriptionDto {
  patientId?: string;
  prescriptionId?: string;
  items: DispenseItemDto[];
  notes?: string;
}

export interface StockAdjustmentDto {
  medicineId: string;
  batchId?: string;
  type: MedicineMovementType;
  quantity: number;
  reference?: string;
  notes?: string;
}
