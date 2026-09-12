export type ComplexType = 'college' | 'mall' | 'hospital' | 'office' | 'airport' | 'convention';

export type RoomType =
  | 'Classroom'
  | 'Laboratory'
  | 'Office'
  | 'Library'
  | 'Auditorium'
  | 'Conference Room'
  | 'Restroom'
  | 'Stairs'
  | 'Elevator'
  | 'Storage'
  | 'Entrance'
  | 'Exit'
  | 'Other';

export type FacilityType =
  | 'Canteen'
  | 'Food Court'
  | 'Book Store'
  | 'ATM'
  | 'Pharmacy'
  | 'Reception'
  | 'Restroom'
  | 'Help Desk'
  | 'Parking'
  | 'Medical Room'
  | 'Gym';

export type UserRole =
  | 'Super Admin'
  | 'College Admin'
  | 'Building Manager'
  | 'Editor'
  | 'User'
  | 'Admin'
  | 'admin'
  | 'Student'
  | 'Faculty'
  | 'Staff'
  | 'Campus Administrator';

export interface College {
  id: string;
  name: string;
  type: ComplexType;
  location: string;
  description: string;
  image: string;
  buildingsCount: number;
  blocksCount: number;
  floorsCount: number;
  roomsCount: number;
  status: 'Active' | 'Inactive';
  featured?: boolean;
}

export interface Building {
  id: string;
  collegeId: string;
  name: string;
  type: string;
  location: string;
  description: string;
  image: string;
  blocksCount: number;
  floorsCount: number;
  roomsCount: number;
  status: 'Active' | 'Inactive';
}

export interface Block {
  id: string;
  buildingId: string;
  collegeId: string;
  name: string;
  description: string;
  image: string;
  floorsCount: number;
  roomsCount: number;
  importantFacilities: string[];
  status: 'Active' | 'Inactive';
  // 2D Campus Map coordinate & bounds
  mapPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
}

export interface Floor {
  id: string;
  blockId: string;
  buildingId: string;
  level: number; // e.g. 0 = Ground Floor, 1 = 1st Floor, 2 = 2nd Floor
  name: string; // "Ground Floor", "1st Floor", "2nd Floor", etc.
  description: string;
  roomsCount: number;
  facilitiesCount: number;
  mapStatus: 'Configured' | 'Draft' | 'Needs Update';
  floorPlanSvgUrl?: string;
  width: number;
  height: number;
}

export interface Room {
  id: string;
  code: string; // e.g. "Room 204", "AI Lab"
  name: string;
  type: RoomType;
  floorId: string;
  blockId: string;
  buildingId: string;
  collegeId: string;
  floorLevel: number;
  capacity: number;
  accessibility: 'Wheelchair Accessible' | 'Standard' | 'Elevator Required';
  image: string;
  description: string;
  status: 'Active' | 'Maintenance';
  // Visual floor coordinates in percentage or canvas px
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  doorLocation?: {
    x: number;
    y: number;
  };
  nearbyPlaces?: Array<{
    name: string;
    distance: string;
    type: string;
  }>;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  buildingId: string;
  blockId: string;
  floorId: string;
  floorLevel: number;
  location: string;
  description: string;
  image: string;
  openingHours: string;
  status: 'Active' | 'Temporarily Closed';
  coordinates: {
    x: number;
    y: number;
  };
}

export interface MapNode {
  id: string;
  floorId: string;
  blockId: string;
  name: string;
  x: number;
  y: number;
  type: 'corridor' | 'door' | 'stairs' | 'elevator' | 'entrance' | 'exit' | 'room';
  connectsToFloorId?: string; // For stairs/elevators connecting to other floors
  roomId?: string;
}

export interface MapEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  isAccessible: boolean; // Accessible for wheelchair
  walkwayType?: 'corridor' | 'stairs' | 'elevator' | 'ramp';
}

export interface TurnDirection {
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  action: 'straight' | 'turn-left' | 'turn-right' | 'stairs-up' | 'stairs-down' | 'elevator' | 'arrive';
  floorName?: string;
  targetNodeId?: string;
}

export interface IndoorRoute {
  id: string;
  originNode: MapNode;
  destinationNode: MapNode;
  targetRoom?: Room;
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  isAccessible: boolean;
  multiFloor: boolean;
  floorsInvolved: number[];
  steps: TurnDirection[];
  pathPoints: Array<{ x: number; y: number; floorLevel: number }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
  assignedCollege?: string;
}

export interface RecentActivity {
  id: string;
  type: 'room_added' | 'map_updated' | 'building_added' | 'user_registered' | 'route_updated' | 'facility_added';
  title: string;
  subtitle: string;
  timestamp: string;
  user: string;
}

export interface AnalyticsStats {
  totalNavigations: number;
  uniqueUsers: number;
  avgTimeSec: number;
  mostVisitedFloor: string;
  mostVisitedRoom: string;
  mostPopularBlock: string;
  dailyUsage: Array<{ date: string; navigations: number; users: number }>;
  categoryUsage: Array<{ name: string; percentage: number; color: string }>;
  hourlyDistribution: Array<{ hour: string; count: number }>;
}
