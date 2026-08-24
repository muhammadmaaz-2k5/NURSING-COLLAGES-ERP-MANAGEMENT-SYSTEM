import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { ContentStatus } from '../types/portal.types';

export const PublishStatusBadge: React.FC<{ status: ContentStatus }> = ({ status }) => {
  switch (status) {
    case 'PUBLISHED':
      return <Badge variant="success" size="sm" dot>PUBLISHED</Badge>;
    case 'REVIEW':
      return <Badge variant="warning" size="sm">UNDER REVIEW</Badge>;
    case 'ARCHIVED':
      return <Badge variant="neutral" size="sm">ARCHIVED</Badge>;
    case 'DRAFT':
    default:
      return <Badge variant="neutral" size="sm">DRAFT</Badge>;
  }
};
