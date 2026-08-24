'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../context/ToastContext';
import { dispenseMedicines } from '../../../features/pharmacy/services/pharmacy.api';
import { formatCurrency } from '../../../lib/utils';

interface DispenseCartItem {
  id: string;
  medicineId: string;
  name: string;
  unitPrice: number;
  availableStock: number;
  quantity: number;
}

export default function DispenseCounterPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState('pat-01');
  const [prescriptionId, setPrescriptionId] = useState('RX-2026-092');
  const [notes, setNotes] = useState('Dispensed at Central Pharmacy Counter');

  const [cart, setCart] = useState<DispenseCartItem[]>([
    {
      id: 'cart-1',
      medicineId: 'med-01',
      name: 'Augmentin 625mg (Tablet)',
      unitPrice: 490,
      availableStock: 85,
      quantity: 2,
    },
    {
      id: 'cart-2',
      medicineId: 'med-02',
      name: 'Panadol Extra 500mg (Tablet)',
      unitPrice: 45,
      availableStock: 320,
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addMedToCart = (medId: string) => {
    const medMap: Record<string, { name: string; unitPrice: number; stock: number }> = {
      'med-01': { name: 'Augmentin 625mg', unitPrice: 490, stock: 85 },
      'med-02': { name: 'Panadol Extra 500mg', unitPrice: 45, stock: 320 },
      'med-03': { name: 'Ceftriaxone 1g Inj', unitPrice: 260, stock: 12 },
      'med-04': { name: 'Normal Saline 1000ml', unitPrice: 120, stock: 64 },
    };

    const chosen = medMap[medId];
    if (!chosen) return;

    setCart((prev) => [
      ...prev,
      {
        id: `cart-${Date.now()}`,
        medicineId: medId,
        name: chosen.name,
        unitPrice: chosen.unitPrice,
        availableStock: chosen.stock,
        quantity: 1,
      },
    ]);
  };

  const grandTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleDispense = async () => {
    if (cart.length === 0) {
      toast.error('Cart Empty', 'Please select at least one medicine formulation.');
      return;
    }

    setIsLoading(true);
    try {
      await dispenseMedicines({
        patientId,
        prescriptionId,
        items: cart.map((c) => ({
          medicineId: c.medicineId,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
        })),
        notes,
      });

      toast.success(
        'Prescription Dispensed',
        `Stock deducted via FIFO. Total collected: ${formatCurrency(grandTotal)}.`,
      );
      router.push('/pharmacy');
    } catch (err: any) {
      toast.error('Dispensing Error', err?.message || 'Stock allocation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/pharmacy')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Pharmacy
        </Button>
      </div>

      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">
              Pharmacy Dispensing Counter (FIFO Automated)
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Live Stock Deduction
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scan prescription, verify patient identity, and automatically deduct stock from earliest-expiring batches.
          </p>
        </div>

        {/* Patient Selection Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <Select
            label="Select Patient (MRN) *"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={[
              { value: 'pat-01', label: 'Ahmed Raza (MRN-2026-0045)' },
              { value: 'pat-02', label: 'Fatima Noor (MRN-2026-0089)' },
              { value: 'pat-03', label: 'Usman Ali (MRN-2026-0102)' },
            ]}
          />
          <Input
            label="Prescription Reference #"
            placeholder="e.g. RX-2026-092"
            value={prescriptionId}
            onChange={(e) => setPrescriptionId(e.target.value)}
          />
        </div>

        {/* Quick Add Medicine Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Select
              label="Quick Add Formulation to Cart"
              value=""
              onChange={(e) => {
                if (e.target.value) addMedToCart(e.target.value);
              }}
              options={[
                { value: '', label: '+ Choose medicine to add...' },
                { value: 'med-01', label: 'Augmentin 625mg (Rs. 490 / Box)' },
                { value: 'med-02', label: 'Panadol Extra 500mg (Rs. 45 / Strip)' },
                { value: 'med-03', label: 'Ceftriaxone 1g Inj (Rs. 260 / Vial)' },
                { value: 'med-04', label: 'Normal Saline 1000ml (Rs. 120 / Bottle)' },
              ]}
            />
          </div>
        </div>

        {/* Cart Items Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="p-4 font-bold uppercase">Medicine Formulation</th>
                <th className="p-4 font-bold uppercase text-center">In Stock</th>
                <th className="p-4 font-bold uppercase text-center">Unit Price</th>
                <th className="p-4 font-bold uppercase text-center w-28">Quantity</th>
                <th className="p-4 font-bold uppercase text-right">Line Total</th>
                <th className="p-4 font-bold uppercase text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cart.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-100">{item.name}</td>
                  <td className="p-4 text-center font-mono text-emerald-400">
                    {item.availableStock}
                  </td>
                  <td className="p-4 text-center font-mono text-slate-300">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      min={1}
                      max={item.availableStock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-white text-xs"
                    />
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bill Summary & Dispense Action */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Total Prescription Cost
            </span>
            <h3 className="text-3xl font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(grandTotal)}
            </h3>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleDispense}
            isLoading={isLoading}
            leftIcon={<ShoppingBag className="w-5 h-5" />}
          >
            Confirm & Dispense Stock
          </Button>
        </div>
      </div>
    </div>
  );
}
