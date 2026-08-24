import {
  HostelBuilding,
  HostelRoom,
  HostelBed,
  HostelAllocation,
  HostelDashboardData,
  CreateHostelDto,
  CreateHostelRoomDto,
  AllocateHostelBedDto,
  TransferBedDto,
  CheckOutDto,
} from '../types/hostel.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchHostelDashboard(): Promise<HostelDashboardData> {
  try {
    const res = await fetch(`${API_BASE}/hostel/dashboard`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch hostel dashboard');
    return await res.json();
  } catch {
    return {
      totalBuildings: 2,
      totalRooms: 48,
      totalBeds: 180,
      occupiedBeds: 142,
      availableBeds: 38,
      occupancyRate: 78.8,
      activeResidentsCount: 142,
    };
  }
}

export async function fetchHostels(): Promise<HostelBuilding[]> {
  try {
    const res = await fetch(`${API_BASE}/hostel/hostels`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch hostels');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [
      {
        id: 'hst-01',
        name: 'Fatima Jinnah Female Nursing Residence',
        code: 'HST-F-01',
        gender: 'FEMALE',
        address: 'Campus West Wing, Sector H-8/4, Islamabad',
        totalRoomsCount: 28,
        totalBedsCount: 110,
        occupiedBedsCount: 92,
        availableBedsCount: 18,
        occupancyRate: 83.6,
        rooms: [
          {
            id: 'rm-201',
            roomNumber: 'Room 201',
            floor: '2nd Floor',
            type: 'DOUBLE',
            capacity: 2,
            hostelId: 'hst-01',
            occupiedBedsCount: 2,
            availableBedsCount: 0,
            beds: [
              { id: 'bd-201A', bedNumber: 'B-01', status: 'OCCUPIED', roomId: 'rm-201', currentAllocation: { id: 'alc-01', studentId: 'stud-01', studentName: 'Amina Bibi', studentRegId: 'NUR-2022-0041', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', programName: 'Generic BSN', startDate: '2026-08-01' } },
              { id: 'bd-201B', bedNumber: 'B-02', status: 'OCCUPIED', roomId: 'rm-201', currentAllocation: { id: 'alc-02', studentId: 'stud-04', studentName: 'Zainab Qureshi', studentRegId: 'NUR-2024-0012', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', programName: 'Generic BSN', startDate: '2026-08-01' } },
            ],
          },
          {
            id: 'rm-202',
            roomNumber: 'Room 202',
            floor: '2nd Floor',
            type: 'DOUBLE',
            capacity: 2,
            hostelId: 'hst-01',
            occupiedBedsCount: 1,
            availableBedsCount: 1,
            beds: [
              { id: 'bd-202A', bedNumber: 'B-01', status: 'OCCUPIED', roomId: 'rm-202', currentAllocation: { id: 'alc-03', studentId: 'stud-03', studentName: 'Farah Naz', studentRegId: 'NUR-2023-0104', avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150', programName: 'Post-RN BSN', startDate: '2026-08-01' } },
              { id: 'bd-202B', bedNumber: 'B-02', status: 'AVAILABLE', roomId: 'rm-202' },
            ],
          },
          {
            id: 'rm-203',
            roomNumber: 'Room 203',
            floor: '2nd Floor',
            type: 'TRIPLE',
            capacity: 3,
            hostelId: 'hst-01',
            occupiedBedsCount: 2,
            availableBedsCount: 1,
            beds: [
              { id: 'bd-203A', bedNumber: 'B-01', status: 'OCCUPIED', roomId: 'rm-203' },
              { id: 'bd-203B', bedNumber: 'B-02', status: 'OCCUPIED', roomId: 'rm-203' },
              { id: 'bd-203C', bedNumber: 'B-03', status: 'AVAILABLE', roomId: 'rm-203' },
            ],
          },
        ],
      },
      {
        id: 'hst-02',
        name: 'Sir Syed Male Healthcare Students Hall',
        code: 'HST-M-01',
        gender: 'MALE',
        address: 'Campus East Wing, Sector H-8/4, Islamabad',
        totalRoomsCount: 20,
        totalBedsCount: 70,
        occupiedBedsCount: 50,
        availableBedsCount: 20,
        occupancyRate: 71.4,
        rooms: [
          {
            id: 'rm-101',
            roomNumber: 'Room 101',
            floor: '1st Floor',
            type: 'DOUBLE',
            capacity: 2,
            hostelId: 'hst-02',
            occupiedBedsCount: 1,
            availableBedsCount: 1,
            beds: [
              { id: 'bd-101A', bedNumber: 'B-01', status: 'OCCUPIED', roomId: 'rm-101', currentAllocation: { id: 'alc-04', studentId: 'stud-02', studentName: 'Bilal Khan', studentRegId: 'NUR-2022-0089', avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150', programName: 'Generic BSN', startDate: '2026-08-01' } },
              { id: 'bd-101B', bedNumber: 'B-02', status: 'AVAILABLE', roomId: 'rm-101' },
            ],
          },
        ],
      },
    ];
  }
}

export async function createHostel(dto: CreateHostelDto) {
  const res = await fetch(`${API_BASE}/hostel/hostels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to register hostel building');
  }

  return await res.json();
}

export async function createRoom(dto: CreateHostelRoomDto) {
  const res = await fetch(`${API_BASE}/hostel/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create room');
  }

  return await res.json();
}

export async function allocateBed(dto: AllocateHostelBedDto) {
  const res = await fetch(`${API_BASE}/hostel/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Bed is already occupied or unavailable');
  }

  return await res.json();
}

export async function transferBed(allocationId: string, targetBedId: string) {
  const res = await fetch(`${API_BASE}/hostel/allocations/${allocationId}/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetBedId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Target bed is unavailable or invalid');
  }

  return await res.json();
}

export async function checkOut(allocationId: string, remarks?: string) {
  const res = await fetch(`${API_BASE}/hostel/allocations/${allocationId}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ remarks }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Checkout failed');
  }

  return await res.json();
}
