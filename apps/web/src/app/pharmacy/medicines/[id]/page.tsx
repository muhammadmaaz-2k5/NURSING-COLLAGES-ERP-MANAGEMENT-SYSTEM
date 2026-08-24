'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Pill,
  Package,
  Layers,
  AlertTriangle,
  Calendar,
  DollarSign,
  Plus,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { ExpiryStatusBadge } from '../../../../features/pharmacy/components/ExpiryStatusBadge';
import { BatchModal } from '../../../../features/pharmacy/components/BatchModal';
import { fetchMedicineById } from '../../../../features/pharmacy/services/pharmacy.api';
import { MedicineDetail } from '../../../../features/pharmacy/types/pharmacy.types';
import { formatCurrency, formatDate } from '../../../../lib/utils';

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const medicineId = params?.id as string;

  const [medicine, setMedicine] = useState<MedicineDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const loadData = async () => {
    if (!medicineId) return;
    setIsLoading(true);
    try {
      const data = await fetchMedicineById(medicineId);
      setMedicine(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [medicineId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Medicine Stock Profile...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Medicine Formulation Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/pharmacy')}>
          Back to Pharmacy
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/pharmacy')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Formulary Catalog
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsBatchModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Receive Stock Batch
        </Button>
      </div>

      {/* Overview Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                {medicine.category}
              </Badge>
              <Badge variant={medicine.isLowStock ? 'danger' : 'success'} size="sm" dot>
                {medicine.isLowStock ? 'LOW STOCK ALERT' : 'OPTIMAL STOCK'}
              </Badge>
            </div>

            <h1 className="text-2xl font-black text-white">{medicine.name}</h1>
            <p className="text-xs text-blue-400 font-medium">{medicine.genericName}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Current Stock</span>
              <p
                className={`text-2xl font-black font-mono mt-0.5 ${
                  medicine.isLowStock ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {medicine.totalStock}
              </p>
              <span className="text-[10px] text-slate-400 block">{medicine.unit}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Selling Price</span>
              <p className="text-2xl font-black font-mono text-white mt-0.5">
                {formatCurrency(medicine.sellingPrice)}
              </p>
              <span className="text-[10px] text-slate-400 block">
                Cost: {formatCurrency(medicine.purchasePrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulation Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Dosage Form</span>
            <span className="font-bold text-slate-200">{medicine.dosageForm}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Strength / Potency</span>
            <span className="font-mono font-bold text-slate-200">{medicine.strength}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Manufacturer</span>
            <span className="font-bold text-slate-200">{medicine.manufacturer || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Reorder Threshold</span>
            <span className="font-mono font-bold text-amber-400">{medicine.reorderLevel} Units</span>
          </div>
        </div>
      </div>

      {/* Active Batches Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Inventory Batches & Expiry (FIFO Tracked)</CardTitle>
            <CardDescription>
              Batches are automatically consumed in First-In-First-Out sequence based on earliest expiry date
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Batch Number</th>
                <th className="pb-3 font-bold uppercase text-center">Available Stock</th>
                <th className="pb-3 font-bold uppercase">Expiry Status</th>
                <th className="pb-3 font-bold uppercase text-right">Cost Price</th>
                <th className="pb-3 font-bold uppercase text-right">Retail Price</th>
                <th className="pb-3 font-bold uppercase">Batch Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {medicine.batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-blue-400">{b.batchNumber}</td>
                  <td className="py-3 text-center font-mono font-bold text-white text-sm">
                    {b.quantity}
                  </td>
                  <td className="py-3">
                    <ExpiryStatusBadge
                      expiryDate={b.expiryDate}
                      isExpired={b.isExpired}
                      isExpiringSoon={b.isExpiringSoon}
                      daysUntilExpiry={b.daysUntilExpiry}
                    />
                  </td>
                  <td className="py-3 text-right font-mono text-slate-400">
                    {formatCurrency(b.purchasePrice)}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(b.sellingPrice)}
                  </td>
                  <td className="py-3 text-slate-400">{b.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stock Movements Ledger */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Recent Stock Movement Transactions</CardTitle>
            <CardDescription>
              Audit trail of purchases, dispensations, and adjustments for this formulation
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Date</th>
                <th className="pb-3 font-bold uppercase">Movement Type</th>
                <th className="pb-3 font-bold uppercase text-center">Batch</th>
                <th className="pb-3 font-bold uppercase text-right">Quantity</th>
                <th className="pb-3 font-bold uppercase text-right">Balance After</th>
                <th className="pb-3 font-bold uppercase">Reference / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {medicine.movements?.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-400">{formatDate(m.createdAt)}</td>
                  <td className="py-3">
                    <Badge variant={m.type === 'PURCHASE' ? 'success' : 'primary'} size="sm">
                      {m.type}
                    </Badge>
                  </td>
                  <td className="py-3 text-center font-mono text-blue-400">{m.batchNumber || '—'}</td>
                  <td className="py-3 text-right font-mono font-bold">
                    <span className={m.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white">
                    {m.balanceAfter}
                  </td>
                  <td className="py-3 text-slate-400">
                    <span className="font-mono text-slate-300 mr-2">{m.reference}</span>
                    {m.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Batch Modal */}
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
