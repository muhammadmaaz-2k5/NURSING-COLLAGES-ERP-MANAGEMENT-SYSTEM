export interface TransportVehicle {
  id: string;
  registrationNo: string;
  name?: string;
  type?: string;
  capacity: number;
  allocatedSeatsCount: number;
  availableSeatsCount: number;
  utilizationRate: number;
  driverName?: string;
  driverPhone?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  currentRoute?: {
    id: string;
    name: string;
  };
}

export interface TransportStop {
  id: string;
  routeId: string;
  name: string;
  sequence: number;
  pickupTime?: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  startPoint?: string;
  endPoint?: string;
  vehicleId: string;
  vehicle?: TransportVehicle;
  stops: TransportStop[];
  totalStudentsCount: number;
}

export interface TransportAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentRegId: string;
  avatarUrl?: string;
  programName?: string;
  vehicleId: string;
  vehicleRegNo: string;
  routeName: string;
  stopName?: string;
  pickupTime?: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'CANCELLED';
}

export interface TransportDashboardData {
  totalVehicles: number;
  totalRoutes: number;
  totalSeatsCapacity: number;
  totalEnrolledStudents: number;
  availableSeats: number;
  fleetUtilizationRate: number;
}

export interface CreateVehicleDto {
  registrationNo: string;
  name?: string;
  type?: string;
  capacity?: number;
  driverName?: string;
  driverPhone?: string;
}

export interface CreateRouteDto {
  vehicleId: string;
  name: string;
  startPoint?: string;
  endPoint?: string;
}

export interface CreateStopDto {
  routeId: string;
  name: string;
  sequence: number;
  pickupTime?: string;
}

export interface AssignTransportDto {
  studentId: string;
  vehicleId: string;
  stopId?: string;
  startDate: string;
  endDate?: string;
}
