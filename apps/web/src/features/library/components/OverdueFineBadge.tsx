import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency } from '../../../lib/utils';

export const OverdueFineBadge: React.FC<{
  isOverdue?: boolean;
  daysOverdue?: number;
  fineAmount?: number;
}> = ({ isOverdue, daysOverdue, fineAmount }) => {
  if (isOverdue && daysOverdue && daysOverdue > 0) {
    return (
      <Badge variant="danger" size="sm" dot>
        OVERDUE ({daysOverdue}d • Fine {formatCurrency(fineAmount || 0)})
      </Badge>
    );
  }

  return <Badge variant="success" size="sm">ON LOAN</Badge>;
};
