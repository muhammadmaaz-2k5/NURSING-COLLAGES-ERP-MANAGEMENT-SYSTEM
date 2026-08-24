'use client';

import React, { useState } from 'react';
import {
  Pill,
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  Search,
  ShoppingCart,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'batches' | 'dispense' | 'expiring' | 'movements'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalFormulations: 245,
    inventoryValue: 'PKR 1,840,500',
    lowStockAlerts: 8,
    expiringAlerts: 5,
  };

  const medicines = [
    { id: '1', name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate', category: 'Antibiotics', unit: 'Capsule', stock: 1200, reorderLevel: 200, price: 'PKR 15.00', status: 'IN_STOCK' },
    { id: '2', name: 'Augmentin 625mg', generic: 'Amoxicillin + Clavulanic Acid', category: 'Antibiotics', unit: 'Tablet', stock: 180, reorderLevel: 200, price: 'PKR 45.00', status: 'LOW_STOCK' },
    { id: '3', name: 'Paracetamol 500mg (Panadol)', generic: 'Acetaminophen', category: 'Analgesics', unit: 'Tablet', stock: 4500, reorderLevel: 500, price: 'PKR 3.50', status: 'IN_STOCK' },
    { id: '4', name: 'Ceftriaxone 1g Injection', generic: 'Ceftriaxone Sodium', category: 'Injectables', unit: 'Vial', stock: 45, reorderLevel: 100, price: 'PKR 280.00', status: 'LOW_STOCK' },
    { id: '5', name: 'Cravit 500mg', generic: 'Levofloxacin', category: 'Fluoroquinolones', unit: 'Tablet', stock: 0, reorderLevel: 50, price: 'PKR 65.00', status: 'OUT_OF_STOCK' },
  ];

  const batches = [
    { id: 'B-1', medicine: 'Amoxicillin 500mg', batchNo: 'BAT-2026-X89', quantity: 800, expiry: '2028-06-30', supplier: 'GSK Pakistan', status: 'VALID' },
    { id: 'B-2', medicine: 'Augmentin 625mg', batchNo: 'BAT-2025-A12', quantity: 180, expiry: '2026-09-15', supplier: 'GSK Pakistan', status: 'EXPIRING_SOON' },
    { id: 'B-3', medicine: 'Ceftriaxone 1g Injection', batchNo: 'BAT-2024-C90', quantity: 45, expiry: '2026-09-05', supplier: 'Sami Pharma', status: 'EXPIRING_SOON' },
    { id: 'B-4', medicine: 'Paracetamol 500mg', batchNo: 'BAT-2026-P01', quantity: 4500, expiry: '2029-01-01', supplier: 'GlaxoSmithKline', status: 'VALID' },
  ];

  const movements = [
    { id: 'MOV-101', type: 'PURCHASE', medicine: 'Amoxicillin 500mg', qty: '+500', batch: 'BAT-2026-X89', time: 'Today 09:15 AM', user: 'Pharmacist Ayesha' },
    { id: 'MOV-102', type: 'DISPENSE', medicine: 'Augmentin 625mg', qty: '-20', batch: 'BAT-2025-A12', time: 'Today 10:45 AM', user: 'Pharmacist Ayesha' },
    { id: 'MOV-103', type: 'ADJUSTMENT_IN', medicine: 'Paracetamol 500mg', qty: '+100', batch: 'BAT-2026-P01', time: 'Yesterday', user: 'Inventory Manager' },
    { id: 'MOV-104', type: 'DISPENSE', medicine: 'Ceftriaxone 1g Injection', qty: '-5', batch: 'BAT-2024-C90', time: 'Yesterday', user: 'IPD Pharmacy' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Pharmacy & Medicine Dispensary</h2>
          <p>Pharmaceutical inventory, FIFO batch tracking, transactional dispensing, barcode management, and expiry audit logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
            ● Pharmacy Module Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Active Catalog Items" value={`${stats.totalFormulations} Medicines`} icon={Pill} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Total Stock Valuation" value={stats.inventoryValue} icon={DollarSign} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Low Stock Reorders" value={`${stats.lowStockAlerts} Items`} icon={AlertTriangle} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Expiring (60 Days)" value={`${stats.expiringAlerts} Batches`} icon={Clock} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'inventory', label: 'Medicine Stock Inventory' },
          { id: 'batches', label: 'Batch Lots & Expiry Tracking' },
          { id: 'dispense', label: 'Point-of-Sale / Dispensing' },
          { id: 'expiring', label: 'Expiry & Low-Stock Alerts' },
          { id: 'movements', label: 'Stock Movement Ledger' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-primary-gradient)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--border-color)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Inventory Catalog */}
      {activeTab === 'inventory' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Pharmaceutical Formulations</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search brand, generic name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                />
              </div>
              <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                + Add Medicine
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Generic Name</th>
                <th>Category</th>
                <th>Available Qty</th>
                <th>Reorder Level</th>
                <th>Retail Unit Price</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m.id}>
                  <td><strong style={{ color: '#fff' }}>{m.name}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{m.generic}</td>
                  <td><span className="code-pill">{m.category}</span></td>
                  <td><strong style={{ color: m.stock === 0 ? '#f43f5e' : m.stock <= m.reorderLevel ? '#fbbf24' : '#34d399' }}>{m.stock} {m.unit}s</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{m.reorderLevel} {m.unit}s</td>
                  <td>{m.price}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: m.status === 'OUT_OF_STOCK' ? 'rgba(244, 63, 94, 0.15)' : m.status === 'LOW_STOCK' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: m.status === 'OUT_OF_STOCK' ? '#f43f5e' : m.status === 'LOW_STOCK' ? '#fbbf24' : '#34d399',
                      }}
                    >
                      {m.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Batch Lots */}
      {activeTab === 'batches' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Inventory Batch Breakdown (FIFO Priority)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Track lot manufacturing dates, supplier purchase bills, and expiry dates.</p>
            </div>
            <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + Receive New Batch Shipment
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Medicine Name</th>
                <th>Current Units</th>
                <th>Expiry Date</th>
                <th>Manufacturer / Supplier</th>
                <th>Lot Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td><span className="code-pill" style={{ color: '#38bdf8' }}>{b.batchNo}</span></td>
                  <td><strong style={{ color: '#fff' }}>{b.medicine}</strong></td>
                  <td>{b.quantity} Units</td>
                  <td style={{ color: b.status === 'EXPIRING_SOON' ? '#f43f5e' : 'var(--text-secondary)', fontWeight: b.status === 'EXPIRING_SOON' ? 700 : 400 }}>{b.expiry}</td>
                  <td>{b.supplier}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: b.status === 'EXPIRING_SOON' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: b.status === 'EXPIRING_SOON' ? '#f43f5e' : '#34d399',
                      }}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Dispensing POS */}
      {activeTab === 'dispense' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Dispense Medicines Against Prescription</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Real-time stock validation prevents dispensing of expired or insufficient medication units.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Select Patient / MRN</label>
                <select style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                  <option value="">Select Patient...</option>
                  <option value="1">Zubair Khan (MRN-2026-00101)</option>
                  <option value="2">Salma Begum (MRN-2026-00102)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Prescription Reference</label>
                <input type="text" placeholder="e.g. RX-2026-0091" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: 'var(--radius-md)' }} />
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>FIFO Batch</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Amoxicillin 500mg</td>
                  <td><span className="code-pill">BAT-2026-X89</span></td>
                  <td>20 Caps</td>
                  <td>PKR 15.00</td>
                  <td><strong>PKR 300.00</strong></td>
                </tr>
                <tr>
                  <td>Paracetamol 500mg</td>
                  <td><span className="code-pill">BAT-2026-P01</span></td>
                  <td>15 Tabs</td>
                  <td>PKR 3.50</td>
                  <td><strong>PKR 52.50</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '15px', marginBottom: '16px' }}>Dispense Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Count:</span>
                  <span>2 Products (35 Units)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                  <span>PKR 352.50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Discount (0%):</span>
                  <span>PKR 0.00</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700 }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#34d399' }}>PKR 352.50</span>
                </div>
              </div>
            </div>

            <button
              style={{
                width: '100%',
                background: 'var(--accent-primary-gradient)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <ShoppingCart size={18} /> Confirm & Dispense Stock
            </button>
          </div>
        </div>
      )}

      {/* 4. Movements */}
      {activeTab === 'movements' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Stock Movement Audit Ledger</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Comprehensive audit trail of all receipts, sales dispensing, and count adjustments.</p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Movement Type</th>
                <th>Medicine</th>
                <th>Quantity Delta</th>
                <th>Batch Reference</th>
                <th>Timestamp</th>
                <th>Operator</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov) => (
                <tr key={mov.id}>
                  <td><span className="code-pill">{mov.id}</span></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: mov.type === 'PURCHASE' ? 'rgba(16, 185, 129, 0.15)' : mov.type === 'DISPENSE' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: mov.type === 'PURCHASE' ? '#34d399' : mov.type === 'DISPENSE' ? '#60a5fa' : '#fbbf24',
                      }}
                    >
                      {mov.type}
                    </span>
                  </td>
                  <td><strong style={{ color: '#fff' }}>{mov.medicine}</strong></td>
                  <td><span style={{ color: mov.qty.startsWith('+') ? '#34d399' : '#f43f5e', fontWeight: 700 }}>{mov.qty}</span></td>
                  <td><span className="code-pill">{mov.batch}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{mov.time}</td>
                  <td>{mov.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
