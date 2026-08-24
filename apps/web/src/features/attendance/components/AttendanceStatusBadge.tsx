import React from 'react';
import { AttendanceStatus } from '../types/attendance.types';
import { Badge } from '../../../components/ui/Badge';

export const AttendanceStatusBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  switch (status) {
    case 'PRESENT':
      return (
        <Badge variant="success" size="sm" dot>
          Present
        </Badge>
      );
    case 'ABSENT':
      return (
        <Badge variant="danger" size="sm" dot>
          Absent
        </Badge>
      );
    case 'LATE':
      return (
        <Badge variant="warning" size="sm" dot>
          Late
        </Badge>
      );
    case 'LEAVE':
      return (
        <Badge variant="primary" size="sm" dot>
          Approved Leave
        </Badge>
      );
    default:
      return <Badge variant="neutral" size="sm">{status}</Badge>;
  }
};
