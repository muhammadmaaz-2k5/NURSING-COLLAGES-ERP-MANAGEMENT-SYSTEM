import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { formatDate } from '../../../lib/utils';

export const ExpiryStatusBadge: React.FC<{
  expiryDate: string;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
  daysUntilExpiry?: number;
}> = ({ expiryDate, isExpired, isExpiringSoon, daysUntilExpiry }) => {
  if (isExpired) {
    return <Badge variant="danger" size="sm" dot>Expired ({formatDate(expiryDate)})</Badge>;
  }

  if (isExpiringSoon) {
    return (
      <Badge variant="warning" size="sm" dot>
        Expiring ({daysUntilExpiry ? `${daysUntilExpiry}d` : formatDate(expiryDate)})
      </Badge>
    );
  }

  return <Badge variant="success" size="sm">Valid ({formatDate(expiryDate)})</Badge>;
};
