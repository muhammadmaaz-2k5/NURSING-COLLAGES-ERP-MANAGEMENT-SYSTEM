export type HostelRoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'DORMITORY';
export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface HostelBed {
  id: string;
  bedNumber: string;
  status: BedStatus;
  roomId: string;
  roomNumber?: string;
  hostelName?: string;
  currentAllocation?: {
    id: string;
    studentId: string;
    studentName: string;
    studentRegId: string;
    avatarUrl?: string;
    programName?: string;
    startDate: string;
    endDate?: string;
  };
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  floor?: string;
  type: HostelRoomType;
  capacity: number;
  hostelId: string;
  hostelName?: string;
  occupiedBedsCount: number;
  availableBedsCount: number;
  beds: HostelBed[];
}

export interface HostelBuilding {
  id: string;
  name: string;
  code: string;
  gender: Gender;
  address?: string;
  totalRoomsCount: number;
  totalBedsCount: number;
  occupiedBedsCount: number;
  availableBedsCount: number;
  occupancyRate: number;
  rooms: HostelRoom[];
}

export interface HostelAllocation {
  id: string;
  studentId: string;
  studentName: string;
  studentRegId: string;
  avatarUrl?: string;
  programName?: string;
  hostelId: string;
  hostelName: string;
  roomNumber: string;
  bedNumber: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'CHECKED_OUT';
  remarks?: string;
}

export interface HostelDashboardData {
  totalBuildings: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  activeResidentsCount: number;
}

export interface CreateHostelDto {
  name: string;
  code: string;
  gender: Gender;
  address?: string;
}

export interface CreateHostelRoomDto {
  hostelId: string;
  roomNumber: string;
  floor?: string;
  type?: HostelRoomType;
  capacity?: number;
}

export interface AllocateHostelBedDto {
  studentId: string;
  bedId: string;
  startDate: string;
  endDate?: string;
  remarks?: string;
}

export interface TransferBedDto {
  targetBedId: string;
}

export interface CheckOutDto {
  remarks?: string;
}
