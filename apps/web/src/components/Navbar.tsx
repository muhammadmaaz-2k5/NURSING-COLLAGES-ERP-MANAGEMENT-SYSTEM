'use client';

import React from 'react';
import { Building2, ExternalLink, Activity } from 'lucide-react';

interface NavbarProps {
  collegeName?: string;
  collegeCode?: string;
  apiStatus?: string;
}

export function Navbar({ collegeName = 'National Medical College', collegeCode = 'NMC-01', apiStatus = 'connected' }: NavbarProps) {
  return (
    <header className="top-header">
      <div className="tenant-selector">
        <div className="tenant-indicator" />
        <Building2 size={16} color="var(--accent-primary)" />
        <span style={{ fontWeight: 600 }}>{collegeName}</span>
        <span className="code-pill">{collegeCode}</span>
      </div>

      <div className="header-actions">
        <div className={`badge-pill ${apiStatus === 'connected' ? 'success' : 'primary'}`}>
          <Activity size={13} />
          <span>API: {apiStatus}</span>
        </div>

        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="btn-swagger"
        >
          <span>Swagger Docs</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
}
