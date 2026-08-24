const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { status: 'offline', database: { status: 'disconnected', collegesRegistered: 0 } };
  }
}

export async function fetchCollegeProfile() {
  try {
    const res = await fetch(`${API_BASE}/college`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch college profile');
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchModules() {
  try {
    const res = await fetch(`${API_BASE}/modules`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch modules');
    return await res.json();
  } catch {
    return [];
  }
}

export async function toggleModule(moduleName: string, enabled: boolean) {
  const res = await fetch(`${API_BASE}/modules`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ module: moduleName, enabled }),
  });
  if (!res.ok) throw new Error('Failed to toggle module');
  return await res.json();
}

export async function fetchAcademicPrograms() {
  try {
    const res = await fetch(`${API_BASE}/academic/programs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch programs');
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAdmissionStats() {
  try {
    const res = await fetch(`${API_BASE}/admissions/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch {
    return { total: 0, pending: 0, approved: 0, enrolled: 0 };
  }
}
