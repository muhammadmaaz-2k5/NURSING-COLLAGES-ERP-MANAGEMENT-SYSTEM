import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Lock } from 'lucide-react';
import { PayrollStatus } from '../types/hr.types';

export const PayrollStatusBadge: React.FC<{ status: PayrollStatus }> = ({ status }) => {
  switch (status) {
    case 'PAID':
      return (
        <Badge variant="success" size="sm" dot>
          <Lock className="w-3 h-3 mr-1 inline" /> PAID (LOCKED)
        </Badge>
      );
    case 'APPROVED':
      return <Badge variant="purple" size="sm">APPROVED</Badge>;
    case 'CALCULATED':
      return <Badge variant="primary" size="sm">CALCULATED</Badge>;
    case 'REVERSED':
      return <Badge variant="danger" size="sm">REVERSED</Badge>;
    case 'DRAFT':
    default:
      return <Badge variant="neutral" size="sm">DRAFT</Badge>;
  }
};
