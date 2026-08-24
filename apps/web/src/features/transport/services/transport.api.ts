import {
  TransportVehicle,
  TransportRoute,
  TransportStop,
  TransportAssignment,
  TransportDashboardData,
  CreateVehicleDto,
  CreateRouteDto,
  CreateStopDto,
  AssignTransportDto,
} from '../types/transport.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchTransportDashboard(): Promise<TransportDashboardData> {
  try {
    const res = await fetch(`${API_BASE}/transport/dashboard`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch transport dashboard');
    return await res.json();
  } catch {
    return {
      totalVehicles: 4,
      totalRoutes: 4,
      totalSeatsCapacity: 148,
      totalEnrolledStudents: 125,
      availableSeats: 23,
      fleetUtilizationRate: 84.4,
    };
  }
}

export async function fetchVehicles(): Promise<TransportVehicle[]> {
  try {
    const res = await fetch(`${API_BASE}/transport/vehicles`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'veh-01',
        registrationNo: 'ICT-BUS-901',
        name: 'Main Campus Coaster 01',
        type: 'Toyota Coaster 32-Seater',
        capacity: 32,
        allocatedSeatsCount: 28,
        availableSeatsCount: 4,
        utilizationRate: 87.5,
        driverName: 'Muhammad Rafiq',
        driverPhone: '+92 300 9988771',
        status: 'ACTIVE',
        currentRoute: { id: 'rt-01', name: 'Route 1 — Rawalpindi Saddar to Campus' },
      },
      {
        id: 'veh-02',
        registrationNo: 'ICT-BUS-902',
        name: 'Main Campus Coaster 02',
        type: 'Toyota Coaster 32-Seater',
        capacity: 32,
        allocatedSeatsCount: 32,
        availableSeatsCount: 0,
        utilizationRate: 100.0,
        driverName: 'Ghulam Abbas',
        driverPhone: '+92 300 9988772',
        status: 'ACTIVE',
        currentRoute: { id: 'rt-02', name: 'Route 2 — Islamabad F-10 / G-11 Sector to Campus' },
      },
      {
        id: 'veh-03',
        registrationNo: 'ICT-BUS-903',
        name: 'Large Transit Bus 03',
        type: 'Hino 52-Seater Transit Bus',
        capacity: 52,
        allocatedSeatsCount: 45,
        availableSeatsCount: 7,
        utilizationRate: 86.5,
        driverName: 'Abdul Hameed',
        driverPhone: '+92 300 9988773',
        status: 'ACTIVE',
        currentRoute: { id: 'rt-03', name: 'Route 3 — Faizabad & Khanna Pul to Campus' },
      },
      {
        id: 'veh-04',
        registrationNo: 'ICT-BUS-904',
        name: 'Clinical Shuttle Van 04',
        type: 'Toyota HiAce 16-Seater Van',
        capacity: 32,
        allocatedSeatsCount: 20,
        availableSeatsCount: 12,
        utilizationRate: 62.5,
        driverName: 'Tariq Mehmood',
        driverPhone: '+92 300 9988774',
        status: 'ACTIVE',
        currentRoute: { id: 'rt-04', name: 'Route 4 — PWD / Media Town to Campus' },
      },
    ];
  }
}

export async function fetchRoutes(): Promise<TransportRoute[]> {
  try {
    const res = await fetch(`${API_BASE}/transport/routes`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch routes');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'rt-01',
        name: 'Route 1 — Rawalpindi Saddar to Campus',
        startPoint: 'Saddar Metro Station, Rawalpindi',
        endPoint: 'Nursing College Main Gate, H-8/4 Islamabad',
        vehicleId: 'veh-01',
        vehicle: {
          id: 'veh-01',
          registrationNo: 'ICT-BUS-901',
          name: 'Main Campus Coaster 01',
          type: 'Toyota Coaster 32-Seater',
          capacity: 32,
          allocatedSeatsCount: 28,
          availableSeatsCount: 4,
          utilizationRate: 87.5,
          driverName: 'Muhammad Rafiq',
          driverPhone: '+92 300 9988771',
          status: 'ACTIVE',
        },
        totalStudentsCount: 28,
        stops: [
          { id: 'stp-01', routeId: 'rt-01', name: 'Saddar Metro Terminal', sequence: 1, pickupTime: '06:50 AM' },
          { id: 'stp-02', routeId: 'rt-01', name: 'Murree Road / Chandni Chowk', sequence: 2, pickupTime: '07:05 AM' },
          { id: 'stp-03', routeId: 'rt-01', name: 'Faizabad Interchange Terminal', sequence: 3, pickupTime: '07:20 AM' },
          { id: 'stp-04', routeId: 'rt-01', name: 'Zero Point Interchange', sequence: 4, pickupTime: '07:35 AM' },
          { id: 'stp-05', routeId: 'rt-01', name: 'Nursing College Campus Gate', sequence: 5, pickupTime: '07:45 AM' },
        ],
      },
      {
        id: 'rt-02',
        name: 'Route 2 — Islamabad F-10 / G-11 Sector to Campus',
        startPoint: 'F-10 Markaz Roundabout',
        endPoint: 'Nursing College Main Gate, H-8/4 Islamabad',
        vehicleId: 'veh-02',
        vehicle: {
          id: 'veh-02',
          registrationNo: 'ICT-BUS-902',
          name: 'Main Campus Coaster 02',
          type: 'Toyota Coaster 32-Seater',
          capacity: 32,
          allocatedSeatsCount: 32,
          availableSeatsCount: 0,
          utilizationRate: 100.0,
          driverName: 'Ghulam Abbas',
          driverPhone: '+92 300 9988772',
          status: 'ACTIVE',
        },
        totalStudentsCount: 32,
        stops: [
          { id: 'stp-06', routeId: 'rt-02', name: 'F-10 Markaz Roundabout', sequence: 1, pickupTime: '07:00 AM' },
          { id: 'stp-07', routeId: 'rt-02', name: 'G-11 Signal', sequence: 2, pickupTime: '07:15 AM' },
          { id: 'stp-08', routeId: 'rt-02', name: 'G-9 Markaz / Karachi Company', sequence: 3, pickupTime: '07:25 AM' },
          { id: 'stp-09', routeId: 'rt-02', name: 'Nursing College Campus Gate', sequence: 4, pickupTime: '07:45 AM' },
        ],
      },
    ];
  }
}

export async function fetchAssignments(): Promise<TransportAssignment[]> {
  try {
    const res = await fetch(`${API_BASE}/transport/assignments`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch assignments');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'asg-01',
        studentId: 'stud-01',
        studentName: 'Amina Bibi',
        studentRegId: 'NUR-2022-0041',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        programName: 'Generic BSN',
        vehicleId: 'veh-01',
        vehicleRegNo: 'ICT-BUS-901',
        routeName: 'Route 1 — Rawalpindi Saddar to Campus',
        stopName: 'Faizabad Interchange Terminal',
        pickupTime: '07:20 AM',
        startDate: '2026-08-01',
        status: 'ACTIVE',
      },
      {
        id: 'asg-02',
        studentId: 'stud-02',
        studentName: 'Bilal Khan',
        studentRegId: 'NUR-2022-0089',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        programName: 'Generic BSN',
        vehicleId: 'veh-01',
        vehicleRegNo: 'ICT-BUS-901',
        routeName: 'Route 1 — Rawalpindi Saddar to Campus',
        stopName: 'Chandni Chowk',
        pickupTime: '07:05 AM',
        startDate: '2026-08-01',
        status: 'ACTIVE',
      },
      {
        id: 'asg-03',
        studentId: 'stud-03',
        studentName: 'Farah Naz',
        studentRegId: 'NUR-2023-0104',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150',
        programName: 'Post-RN BSN',
        vehicleId: 'veh-02',
        vehicleRegNo: 'ICT-BUS-902',
        routeName: 'Route 2 — Islamabad F-10 to Campus',
        stopName: 'G-11 Signal',
        pickupTime: '07:15 AM',
        startDate: '2026-08-01',
        status: 'ACTIVE',
      },
    ];
  }
}

export async function createVehicle(dto: CreateVehicleDto) {
  const res = await fetch(`${API_BASE}/transport/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to register transport vehicle');
  }

  return await res.json();
}

export async function createRoute(dto: CreateRouteDto) {
  const res = await fetch(`${API_BASE}/transport/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create route');
  }

  return await res.json();
}

export async function createStop(dto: CreateStopDto) {
  const res = await fetch(`${API_BASE}/transport/stops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create stop');
  }

  return await res.json();
}

export async function assignTransport(dto: AssignTransportDto) {
  const res = await fetch(`${API_BASE}/transport/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Vehicle seating capacity reached or unavailable');
  }

  return await res.json();
}

export async function cancelAssignment(id: string) {
  const res = await fetch(`${API_BASE}/transport/assignments/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to cancel assignment');
  }

  return await res.json();
}
