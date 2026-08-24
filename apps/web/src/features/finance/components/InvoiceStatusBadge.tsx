import React from 'react';
import { PaymentStatus } from '../types/finance.types';
import { Badge } from '../../../components/ui/Badge';

export const InvoiceStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  switch (status) {
    case 'PAID':
      return <Badge variant="success" size="sm" dot>Paid in Full</Badge>;
    case 'PARTIAL':
      return <Badge variant="warning" size="sm" dot>Partially Paid</Badge>;
    case 'UNPAID':
      return <Badge variant="danger" size="sm" dot>Unpaid</Badge>;
    case 'OVERDUE':
      return <Badge variant="purple" size="sm" dot>Overdue</Badge>;
    case 'REFUNDED':
      return <Badge variant="neutral" size="sm">Refunded</Badge>;
    default:
      return <Badge variant="neutral" size="sm">{status}</Badge>;
  }
};
