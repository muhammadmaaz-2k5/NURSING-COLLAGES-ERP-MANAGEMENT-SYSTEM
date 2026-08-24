'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Pill,
  Layers,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingDown,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ExpiryStatusBadge } from '../../features/pharmacy/components/ExpiryStatusBadge';
import { MedicineModal } from '../../features/pharmacy/components/MedicineModal';
import { BatchModal } from '../../features/pharmacy/components/BatchModal';
import { DispenseModal } from '../../features/pharmacy/components/DispenseModal';
import {
  fetchPharmacyOverview,
  fetchMedicines,
  fetchStockMovements,
} from '../../features/pharmacy/services/pharmacy.api';
import {
  Medicine,
  StockMovement,
  PharmacyOverviewData,
} from '../../features/pharmacy/types/pharmacy.types';
import { formatCurrency, formatDate } from '../../lib/utils';

type PharmacyTab = 'medicines' | 'batches' | 'movements' | 'alerts';

export default function PharmacyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PharmacyTab>('medicines');
  const [overview, setOverview] = useState<PharmacyOverviewData | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ovRes, medRes, movRes] = await Promise.all([
        fetchPharmacyOverview(),
        fetchMedicines(),
        fetchStockMovements(),
      ]);
      setOverview(ovRes);
      setMedicines(medRes.data);
      setMovements(movRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const medicineColumns: Column<Medicine>[] = [
    {
      header: 'Medicine & Generic Name',
      accessorKey: 'name',
      sortable: true,
      cell: (m) => (
        <div>
          <p className="font-bold text-slate-100">{m.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-blue-400 font-semibold">{m.genericName || '—'}</span>
            <span className="text-slate-400 text-xs">• {m.dosageForm}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category & Strength',
      accessorKey: 'category',
      sortable: true,
      cell: (m) => (
        <div className="text-xs">
          <Badge variant="purple" size="sm">
            {m.category || 'General'}
          </Badge>
          <span className="font-mono text-slate-400 block mt-1">{m.strength}</span>
        </div>
      ),
    },
    {
      header: 'Stock / Reorder Level',
      sortable: true,
      cell: (m) => (
        <div className="font-mono text-xs">
          <span
            className={`font-bold text-sm ${
              m.isLowStock ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {m.totalStock} {m.unit || 'Units'}
          </span>
          <span className="text-slate-500 block text-[10px]">
            Reorder at: {m.reorderLevel}
          </span>
        </div>
      ),
    },
    {
      header: 'Pricing',
      sortable: true,
      cell: (m) => (
        <div className="font-mono text-xs">
          <span className="text-white font-bold">{formatCurrency(m.sellingPrice)}</span>
          <span className="text-slate-500 block text-[10px]">
            Cost: {formatCurrency(m.purchasePrice)}
          </span>
        </div>
      ),
    },
    {
      header: 'Stock Status',
      cell: (m) => (
        <Badge variant={m.isLowStock ? 'danger' : 'success'} size="sm" dot>
          {m.isLowStock ? 'LOW STOCK' : 'IN STOCK'}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (m) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/pharmacy/medicines/${m.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Batches & FIFO
        </Button>
      ),
    },
  ];

  const movementColumns: Column<StockMovement>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (mov) => <span className="font-mono text-slate-400 text-xs">{formatDate(mov.createdAt)}</span>,
    },
    {
      header: 'Medicine & Batch',
      accessorKey: 'medicineName',
      sortable: true,
      cell: (mov) => (
        <div>
          <p className="font-bold text-slate-100">{mov.medicineName}</p>
          {mov.batchNumber && (
            <span className="font-mono text-xs text-blue-400">{mov.batchNumber}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Movement Type',
      accessorKey: 'type',
      cell: (mov) => (
        <Badge
          variant={
            mov.type === 'PURCHASE' || mov.type === 'ADJUSTMENT_IN' ? 'success' : 'primary'
          }
          size="sm"
        >
          {mov.type}
        </Badge>
      ),
    },
    {
      header: 'Quantity Transacted',
      accessorKey: 'quantity',
      sortable: true,
      cell: (mov) => (
        <span
          className={`font-mono font-bold text-sm ${
            mov.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
        </span>
      ),
    },
    {
      header: 'Balance After',
      accessorKey: 'balanceAfter',
      cell: (mov) => <span className="font-mono text-white text-xs">{mov.balanceAfter}</span>,
    },
    {
      header: 'Reference & Notes',
      accessorKey: 'notes',
      cell: (mov) => (
        <div className="text-xs text-slate-400">
          <span className="font-mono text-slate-300 block">{mov.reference || '—'}</span>
          <span>{mov.notes || '—'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Pharmacy & Medicine Inventory
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Automated FIFO Allocation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage hospital pharmaceutical formulary, batch expiry tracking, prescription dispensing, and stock movement ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMedicineModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Medicine
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBatchModalOpen(true)}
            leftIcon={<Package className="w-4 h-4" />}
          >
            Receive Stock Batch
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDispenseModalOpen(true)}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Dispense Medicines
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Formulations
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {overview?.totalMedicines || 248}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Active Formulary Items</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Stock Units
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {overview?.totalStockUnits?.toLocaleString() || '14,500'}
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">In Central Dispensary</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Low Stock Alerts
          </span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">
            {overview?.lowStockCount || 4}
          </h3>
          <p className="text-xs text-rose-300 mt-2 font-medium">Below Reorder Threshold</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Expiring Batches (&lt;60d)
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {overview?.expiringBatchesCount || 2}
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Requires FIFO Clearance</p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'medicines' as const, label: 'Formulary Catalog', icon: Pill, count: medicines.length },
          { id: 'movements' as const, label: 'Stock Movement Ledger', icon: Layers, count: movements.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}

      {/* 1. MEDICINE CATALOG */}
      {activeTab === 'medicines' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Pharmaceutical Formulary & Inventory</CardTitle>
              <CardDescription>
                Search medicines by brand name, generic compound, or therapeutic category
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={medicineColumns}
            data={medicines}
            isLoading={isLoading}
            searchPlaceholder="Search by brand name, generic, or category..."
            pageSize={10}
            onRowClick={(m) => router.push(`/pharmacy/medicines/${m.id}`)}
          />
        </Card>
      )}

      {/* 2. STOCK MOVEMENTS */}
      {activeTab === 'movements' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Stock Movement Ledger & Audit Trail</CardTitle>
              <CardDescription>
                Running inventory ledger tracking purchases, dispensations, and adjustments
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={movementColumns}
            data={movements}
            isLoading={isLoading}
            searchPlaceholder="Search by medicine, batch, or reference..."
            pageSize={10}
          />
        </Card>
      )}

      {/* Modals */}
      <MedicineModal
        isOpen={isMedicineModalOpen}
        onClose={() => setIsMedicineModalOpen(false)}
        onSuccess={loadData}
      />

      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSuccess={loadData}
      />

      <DispenseModal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
