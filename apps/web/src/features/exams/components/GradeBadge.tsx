import React from 'react';
import { Badge } from '../../../components/ui/Badge';

export const GradeBadge: React.FC<{ grade: string }> = ({ grade }) => {
  switch (grade?.toUpperCase()) {
    case 'A+':
    case 'A':
      return <Badge variant="success" size="sm">{grade}</Badge>;
    case 'B+':
    case 'B':
      return <Badge variant="primary" size="sm">{grade}</Badge>;
    case 'C+':
    case 'C':
      return <Badge variant="warning" size="sm">{grade}</Badge>;
    case 'F':
      return <Badge variant="danger" size="sm" dot>FAIL ({grade})</Badge>;
    default:
      return <Badge variant="neutral" size="sm">{grade || '—'}</Badge>;
  }
};
