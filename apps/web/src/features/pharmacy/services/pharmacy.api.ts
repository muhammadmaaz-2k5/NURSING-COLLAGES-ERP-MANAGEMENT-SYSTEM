import {
  Medicine,
  MedicineDetail,
  MedicineBatch,
  StockMovement,
  PharmacyOverviewData,
  CreateMedicineDto,
  AddStockBatchDto,
  DispensePrescriptionDto,
  StockAdjustmentDto,
} from '../types/pharmacy.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchPharmacyOverview(): Promise<PharmacyOverviewData> {
  try {
    const res = await fetch(`${API_BASE}/pharmacy/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch pharmacy overview');
    return await res.json();
  } catch {
    return {
      totalMedicines: 248,
      totalStockUnits: 14500,
      totalStockValue: 1850000,
      lowStockCount: 4,
      expiringBatchesCount: 2,
      dispensedTodayCount: 88,
    };
  }
}

export async function fetchMedicines(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Medicine[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/pharmacy/medicines?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch medicines');
    const json = await res.json();
    if (Array.isArray(json)) return { data: json, total: json.length };
    return { data: json.data || [], total: json.total || json.data?.length || 0 };
  } catch {
    return {
      data: [
        {
          id: 'med-01',
          name: 'Augmentin 625mg',
          genericName: 'Co-Amoxiclav',
          category: 'Antibiotics',
          strength: '625mg',
          dosageForm: 'Tablet',
          manufacturer: 'GSK Pharmaceuticals',
          unit: 'Box of 14 Tablets',
          reorderLevel: 20,
          totalStock: 85,
          purchasePrice: 420,
          sellingPrice: 490,
          isLowStock: false,
          batches: [
            { id: 'bat-01', batchNumber: 'BAT-2026-AUG1', quantity: 85, expiryDate: '2028-04-30', purchasePrice: 420, sellingPrice: 490, isExpired: false, isExpiringSoon: false },
          ],
        },
        {
          id: 'med-02',
          name: 'Panadol Extra 500mg',
          genericName: 'Paracetamol + Caffeine',
          category: 'Analgesics & Antipyretics',
          strength: '500mg/65mg',
          dosageForm: 'Tablet',
          manufacturer: 'Haleon Pakistan',
          unit: 'Strip of 10 Tablets',
          reorderLevel: 50,
          totalStock: 320,
          purchasePrice: 35,
          sellingPrice: 45,
          isLowStock: false,
          batches: [
            { id: 'bat-02', batchNumber: 'BAT-2026-PAN2', quantity: 320, expiryDate: '2027-11-30', purchasePrice: 35, sellingPrice: 45, isExpired: false, isExpiringSoon: false },
          ],
        },
        {
          id: 'med-03',
          name: 'Ceftriaxone 1g Injection',
          genericName: 'Ceftriaxone Sodium',
          category: 'Injectables & Critical Care',
          strength: '1g Vial',
          dosageForm: 'Injection',
          manufacturer: 'Sami Pharmaceuticals',
          unit: 'Vial with Water for Inj',
          reorderLevel: 25,
          totalStock: 12,
          purchasePrice: 210,
          sellingPrice: 260,
          isLowStock: true,
          batches: [
            { id: 'bat-03', batchNumber: 'BAT-2026-CEF9', quantity: 12, expiryDate: '2026-09-30', purchasePrice: 210, sellingPrice: 260, isExpired: false, isExpiringSoon: true, daysUntilExpiry: 36 },
          ],
        },
        {
          id: 'med-04',
          name: 'Normal Saline 0.9% 1000ml',
          genericName: 'Sodium Chloride Infusion',
          category: 'IV Infusions & Fluids',
          strength: '0.9% w/v',
          dosageForm: 'Infusion Drip',
          manufacturer: 'Otsuka Pakistan',
          unit: 'Bottle of 1000ml',
          reorderLevel: 30,
          totalStock: 64,
          purchasePrice: 95,
          sellingPrice: 120,
          isLowStock: false,
          batches: [
            { id: 'bat-04', batchNumber: 'BAT-2026-NS44', quantity: 64, expiryDate: '2028-12-31', purchasePrice: 95, sellingPrice: 120, isExpired: false, isExpiringSoon: false },
          ],
        },
      ],
      total: 4,
    };
  }
}

export async function fetchMedicineById(id: string): Promise<MedicineDetail> {
  try {
    const res = await fetch(`${API_BASE}/pharmacy/medicines/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Medicine not found');
    return await res.json();
  } catch {
    return {
      id: id || 'med-03',
      name: 'Ceftriaxone 1g Injection',
      genericName: 'Ceftriaxone Sodium (3rd Gen Cephalosporin)',
      category: 'Injectables & Critical Care',
      strength: '1g Vial',
      dosageForm: 'IV/IM Injection',
      manufacturer: 'Sami Pharmaceuticals',
      unit: 'Vial with Water for Inj',
      reorderLevel: 25,
      totalStock: 12,
      purchasePrice: 210,
      sellingPrice: 260,
      isLowStock: true,
      batches: [
        {
          id: 'bat-03',
          batchNumber: 'BAT-2026-CEF9',
          quantity: 12,
          expiryDate: '2026-09-30',
          purchasePrice: 210,
          sellingPrice: 260,
          isExpired: false,
          isExpiringSoon: true,
          daysUntilExpiry: 36,
          notes: 'Received via Supplier Invoice PO-2026-011',
        },
      ],
      movements: [
        { id: 'mov-01', medicineId: id || 'med-03', medicineName: 'Ceftriaxone 1g', batchNumber: 'BAT-2026-CEF9', type: 'PURCHASE', quantity: 50, balanceAfter: 50, reference: 'PO-2026-011', notes: 'Initial stock shipment received', createdAt: '2026-08-01' },
        { id: 'mov-02', medicineId: id || 'med-03', medicineName: 'Ceftriaxone 1g', batchNumber: 'BAT-2026-CEF9', type: 'DISPENSE', quantity: -18, balanceAfter: 32, reference: 'RX-2026-088', notes: 'Dispensed for Inpatient Ward 4', createdAt: '2026-08-10' },
        { id: 'mov-03', medicineId: id || 'med-03', medicineName: 'Ceftriaxone 1g', batchNumber: 'BAT-2026-CEF9', type: 'DISPENSE', quantity: -20, balanceAfter: 12, reference: 'RX-2026-140', notes: 'Dispensed for Emergency Dept', createdAt: '2026-08-22' },
      ],
    };
  }
}

export async function fetchStockMovements(medicineId?: string): Promise<StockMovement[]> {
  try {
    const query = new URLSearchParams();
    if (medicineId) query.append('medicineId', medicineId);
    const res = await fetch(`${API_BASE}/pharmacy/movements?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch stock movements');
    return await res.json();
  } catch {
    return [
      { id: 'mov-01', medicineId: 'med-01', medicineName: 'Augmentin 625mg', batchNumber: 'BAT-2026-AUG1', type: 'PURCHASE', quantity: 100, balanceAfter: 100, reference: 'PO-2026-004', notes: 'Stock Shipment received from GSK', createdAt: '2026-08-01' },
      { id: 'mov-02', medicineId: 'med-01', medicineName: 'Augmentin 625mg', batchNumber: 'BAT-2026-AUG1', type: 'DISPENSE', quantity: -15, balanceAfter: 85, reference: 'RX-2026-092', notes: 'Dispensed to OPD Patient MRN-2026-0045', createdAt: '2026-08-24' },
      { id: 'mov-03', medicineId: 'med-03', medicineName: 'Ceftriaxone 1g', batchNumber: 'BAT-2026-CEF9', type: 'DISPENSE', quantity: -20, balanceAfter: 12, reference: 'RX-2026-140', notes: 'Dispensed for Emergency Dept', createdAt: '2026-08-22' },
    ];
  }
}

export async function createMedicine(dto: CreateMedicineDto) {
  const res = await fetch(`${API_BASE}/pharmacy/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create medicine formulation');
  }

  return await res.json();
}

export async function addStockBatch(dto: AddStockBatchDto) {
  const res = await fetch(`${API_BASE}/pharmacy/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to receive stock batch');
  }

  return await res.json();
}

export async function dispenseMedicines(dto: DispensePrescriptionDto) {
  const res = await fetch(`${API_BASE}/pharmacy/dispense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Insufficient stock or invalid batch');
  }

  return await res.json();
}

export async function adjustStock(dto: StockAdjustmentDto) {
  const res = await fetch(`${API_BASE}/pharmacy/adjustments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Stock adjustment failed');
  }

  return await res.json();
}
