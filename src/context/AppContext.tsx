import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  College,
  Building,
  Block,
  Floor,
  Room,
  Facility,
  MapNode,
  MapEdge,
  IndoorRoute,
  TurnDirection,
  AdminUser,
  RecentActivity,
  AnalyticsStats,
} from '../types';
import {
  INITIAL_COLLEGES,
  INITIAL_BUILDINGS,
  INITIAL_BLOCKS,
  INITIAL_FLOORS,
  INITIAL_ROOMS,
  INITIAL_FACILITIES,
  FLOOR_2_NODES,
  INITIAL_EDGES,
  INITIAL_ADMIN_USERS,
  RECENT_ACTIVITIES,
  INITIAL_ANALYTICS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

export type UserView = 'home' | 'buildings' | 'campus' | 'block' | 'map' | 'saved' | 'auth';
export type AdminView =
  | 'dashboard'
  | 'colleges'
  | 'buildings'
  | 'blocks'
  | 'floors'
  | 'editor'
  | 'rooms'
  | 'facilities'
  | 'paths'
  | 'users'
  | 'analytics'
  | 'reports'
  | 'settings'
  | 'profile';

interface AppContextType {
  // Navigation / View states
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  userView: UserView;
  setUserView: (view: UserView) => void;
  adminView: AdminView;
  setAdminView: (view: AdminView) => void;

  // Selected Entities
  selectedCollege: College;
  setSelectedCollege: (college: College) => void;
  selectedBuilding: Building;
  setSelectedBuilding: (building: Building) => void;
  selectedBlock: Block;
  setSelectedBlock: (block: Block) => void;
  selectedFloor: Floor;
  setSelectedFloor: (floor: Floor) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Database Collections
  colleges: College[];
  buildings: Building[];
  blocks: Block[];
  floors: Floor[];
  rooms: Room[];
  facilities: Facility[];
  nodes: MapNode[];
  edges: MapEdge[];
  adminUsers: AdminUser[];
  activities: RecentActivity[];
  analytics: AnalyticsStats;

  // Saved / Bookmarks
  savedRoomIds: string[];
  toggleSaveRoom: (roomId: string) => void;
  isRoomSaved: (roomId: string) => boolean;

  // Indoor Navigation State
  isNavigating: boolean;
  activeRoute: IndoorRoute | null;
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  isSimulatingWalk: boolean;
  startNavigationToRoom: (room: Room) => void;
  startNavigationToFacility: (facility: Facility) => void;
  stopNavigation: () => void;
  startWalkingSimulation: () => void;
  pauseWalkingSimulation: () => void;
  recalculateRoute: () => void;

  // Admin Mutations
  addCollege: (college: Omit<College, 'id'>) => void;
  updateCollege: (college: College) => void;
  deleteCollege: (id: string) => void;

  addBuilding: (bld: Omit<Building, 'id'>) => void;
  updateBuilding: (bld: Building) => void;
  deleteBuilding: (id: string) => void;

  addBlock: (block: Omit<Block, 'id'>) => void;
  updateBlock: (block: Block) => void;
  deleteBlock: (id: string) => void;

  addFloor: (floor: Omit<Floor, 'id'>) => void;
  updateFloor: (floor: Floor) => void;
  deleteFloor: (id: string) => void;

  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;

  addFacility: (facility: Omit<Facility, 'id'>) => void;
  updateFacility: (facility: Facility) => void;
  deleteFacility: (id: string) => void;

  addNode: (node: Omit<MapNode, 'id'>) => void;
  deleteNode: (id: string) => void;

  // User management
  addAdminUser: (userData: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (user: AdminUser) => void;
  deleteAdminUser: (id: string) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Auth
  currentUser: AdminUser | null;
  setCurrentUser: (user: AdminUser | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Views
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [userView, setUserView] = useState<UserView>('home');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');

  // Core Data
  const [colleges, setColleges] = useState<College[]>(() => {
    const saved = localStorage.getItem('pathly_colleges');
    return saved ? JSON.parse(saved) : INITIAL_COLLEGES;
  });

  const [buildings, setBuildings] = useState<Building[]>(() => {
    const saved = localStorage.getItem('pathly_buildings');
    return saved ? JSON.parse(saved) : INITIAL_BUILDINGS;
  });

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const saved = localStorage.getItem('pathly_blocks');
    return saved ? JSON.parse(saved) : INITIAL_BLOCKS;
  });

  const [floors, setFloors] = useState<Floor[]>(() => {
    const saved = localStorage.getItem('pathly_floors');
    return saved ? JSON.parse(saved) : INITIAL_FLOORS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('pathly_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('pathly_facilities');
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const [nodes, setNodes] = useState<MapNode[]>(() => {
    const saved = localStorage.getItem('pathly_nodes');
    return saved ? JSON.parse(saved) : FLOOR_2_NODES;
  });

  const [edges, setEdges] = useState<MapEdge[]>(INITIAL_EDGES);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [activities, setActivities] = useState<RecentActivity[]>(RECENT_ACTIVITIES);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(INITIAL_ANALYTICS);

  // Selections
  const [selectedCollege, setSelectedCollege] = useState<College>(colleges[0]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(buildings[1]); // CSE Block building
  const [selectedBlock, setSelectedBlock] = useState<Block>(blocks[0]); // CSE Block
  const [selectedFloor, setSelectedFloor] = useState<Floor>(floors[2]); // 2nd Floor
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Search & Auth modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pathly_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('pathly_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('pathly_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Saved Rooms
  const [savedRoomIds, setSavedRoomIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pathly_saved_rooms');
    return saved ? JSON.parse(saved) : ['rm-204', 'rm-103'];
  });

  // Navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeRoute, setActiveRoute] = useState<IndoorRoute | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);

  // Save to localStorage and notify auth state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pathly_current_user', JSON.stringify(currentUser));
      localStorage.setItem('pathly_is_authenticated', 'true');
    } else {
      localStorage.removeItem('pathly_current_user');
      localStorage.setItem('pathly_is_authenticated', 'false');
    }
  }, [currentUser]);

  // Listen to external authStore events
  useEffect(() => {
    const handleAuthEvent = (e: any) => {
      const user = e.detail?.user ?? null;
      setCurrentUser(user);
    };
    window.addEventListener('pathly-auth-change', handleAuthEvent);
    return () => window.removeEventListener('pathly-auth-change', handleAuthEvent);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pathly_colleges', JSON.stringify(colleges));
  }, [colleges]);

  useEffect(() => {
    localStorage.setItem('pathly_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('pathly_saved_rooms', JSON.stringify(savedRoomIds));
  }, [savedRoomIds]);

  const toggleSaveRoom = (roomId: string) => {
    setSavedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const isRoomSaved = (roomId: string) => savedRoomIds.includes(roomId);

  // Indoor Route Generation Algorithm
  const buildIndoorRouteForRoom = (targetRoom: Room): IndoorRoute => {
    const originNode: MapNode = {
      id: 'origin-cur',
      floorId: selectedFloor.id,
      blockId: selectedBlock.id,
      name: 'Current Location (Main Corridor Entry)',
      x: 18,
      y: 48,
      type: 'stairs',
    };

    // Find closest door or center coordinate
    const destNode: MapNode = {
      id: `dest-${targetRoom.id}`,
      floorId: targetRoom.floorId,
      blockId: targetRoom.blockId,
      name: `${targetRoom.name}`,
      x: targetRoom.doorLocation ? targetRoom.doorLocation.x : targetRoom.coordinates.x + targetRoom.coordinates.width / 2,
      y: targetRoom.doorLocation ? targetRoom.doorLocation.y : targetRoom.coordinates.y + targetRoom.coordinates.height / 2,
      type: 'room',
      roomId: targetRoom.id,
    };

    const isMultiFloor = selectedFloor.level !== targetRoom.floorLevel;
    const steps: TurnDirection[] = [];

    // Path geometry points on the active floor canvas
    const pathPoints: Array<{ x: number; y: number; floorLevel: number }> = [];

    if (isMultiFloor) {
      steps.push({
        stepNumber: 1,
        instruction: 'Head towards West Staircase on Ground/1st Floor',
        distanceMeters: 20,
        action: 'straight',
        floorName: selectedFloor.name,
      });
      steps.push({
        stepNumber: 2,
        instruction: `Take the staircase up to the ${targetRoom.floorLevel === 2 ? '2nd' : `${targetRoom.floorLevel}th`} Floor`,
        distanceMeters: 30,
        action: 'stairs-up',
        floorName: `${targetRoom.floorLevel}th Floor`,
      });
      steps.push({
        stepNumber: 3,
        instruction: 'Exit stairs onto 2nd Floor main corridor',
        distanceMeters: 10,
        action: 'turn-right',
        floorName: '2nd Floor',
      });
      steps.push({
        stepNumber: 4,
        instruction: 'Continue straight down the central corridor for 60 m',
        distanceMeters: 60,
        action: 'straight',
        floorName: '2nd Floor',
      });
      steps.push({
        stepNumber: 5,
        instruction: `Arrive at destination: ${targetRoom.name} on your right`,
        distanceMeters: 10,
        action: 'arrive',
        floorName: '2nd Floor',
      });

      // SVG path points representing corridor trajectory
      pathPoints.push({ x: 18, y: 48, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: 25, y: 50, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: 42, y: 50, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: destNode.x, y: 50, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: destNode.x, y: destNode.y, floorLevel: targetRoom.floorLevel });
    } else {
      steps.push({
        stepNumber: 1,
        instruction: 'Head north from your current location towards the central corridor',
        distanceMeters: 20,
        action: 'straight',
        floorName: selectedFloor.name,
      });
      steps.push({
        stepNumber: 2,
        instruction: 'Turn right at the corridor intersection',
        distanceMeters: 40,
        action: 'turn-right',
        floorName: selectedFloor.name,
      });
      steps.push({
        stepNumber: 3,
        instruction: 'Continue straight through the atrium corridor',
        distanceMeters: 60,
        action: 'straight',
        floorName: selectedFloor.name,
      });
      steps.push({
        stepNumber: 4,
        instruction: `Destination ${targetRoom.code} is on your right`,
        distanceMeters: 10,
        action: 'arrive',
        floorName: selectedFloor.name,
      });

      pathPoints.push({ x: originNode.x, y: originNode.y, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: 30, y: 50, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: 50, y: 50, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: destNode.x, y: 50, floorLevel: targetRoom.floorLevel });
      pathPoints.push({ x: destNode.x, y: destNode.y, floorLevel: targetRoom.floorLevel });
    }

    const totalDistance = steps.reduce((sum, s) => sum + s.distanceMeters, 0);
    const estimatedTime = Math.ceil(totalDistance * 1.1); // ~1.1s per meter walking

    return {
      id: `route-${Date.now()}`,
      originNode,
      destinationNode: destNode,
      targetRoom,
      totalDistanceMeters: totalDistance,
      estimatedTimeSeconds: estimatedTime,
      isAccessible: targetRoom.accessibility === 'Wheelchair Accessible',
      multiFloor: isMultiFloor,
      floorsInvolved: [selectedFloor.level, targetRoom.floorLevel],
      steps,
      pathPoints,
    };
  };

  const startNavigationToRoom = (room: Room) => {
    // Switch to room's block and floor
    const blk = blocks.find((b) => b.id === room.blockId);
    if (blk) setSelectedBlock(blk);
    const flr = floors.find((f) => f.id === room.floorId);
    if (flr) setSelectedFloor(flr);

    const route = buildIndoorRouteForRoom(room);
    setActiveRoute(route);
    setIsNavigating(true);
    setCurrentStepIndex(0);
    setIsSimulatingWalk(false);
    setUserView('map');
  };

  const startNavigationToFacility = (facility: Facility) => {
    const pseudoRoom: Room = {
      id: facility.id,
      code: facility.name,
      name: facility.name,
      type: 'Other',
      floorId: facility.floorId,
      blockId: facility.blockId,
      buildingId: facility.buildingId,
      collegeId: 'col-1',
      floorLevel: facility.floorLevel,
      capacity: 100,
      accessibility: 'Wheelchair Accessible',
      image: facility.image,
      description: facility.description,
      status: 'Active',
      coordinates: { x: facility.coordinates.x - 6, y: facility.coordinates.y - 6, width: 14, height: 14 },
      doorLocation: facility.coordinates,
    };
    startNavigationToRoom(pseudoRoom);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setActiveRoute(null);
    setCurrentStepIndex(0);
    setIsSimulatingWalk(false);
  };

  const startWalkingSimulation = () => {
    setIsSimulatingWalk(true);
  };

  const pauseWalkingSimulation = () => {
    setIsSimulatingWalk(false);
  };

  const recalculateRoute = () => {
    if (activeRoute?.targetRoom) {
      const freshRoute = buildIndoorRouteForRoom(activeRoute.targetRoom);
      setActiveRoute(freshRoute);
      setCurrentStepIndex(0);
    }
  };

  // Walking simulation tick
  useEffect(() => {
    let timer: any;
    if (isSimulatingWalk && activeRoute) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < activeRoute.steps.length - 1) {
            return prev + 1;
          } else {
            // Reached destination!
            setIsSimulatingWalk(false);
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch (e) {
              // Ignore if canvas isn't ready
            }
            return prev;
          }
        });
      }, 3200);
    }
    return () => clearInterval(timer);
  }, [isSimulatingWalk, activeRoute]);

  // Mutations
  const addCollege = (collegeData: Omit<College, 'id'>) => {
    const newCollege: College = { ...collegeData, id: `col-${Date.now()}` };
    setColleges((prev) => [newCollege, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'building_added',
        title: 'New institution added',
        subtitle: newCollege.name,
        timestamp: 'Just now',
        user: currentUser.name,
      },
      ...prev,
    ]);
  };

  const updateCollege = (updated: College) => {
    setColleges((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedCollege.id === updated.id) setSelectedCollege(updated);
  };

  const deleteCollege = (id: string) => {
    setColleges((prev) => prev.filter((c) => c.id !== id));
  };

  const addBuilding = (bldData: Omit<Building, 'id'>) => {
    const newBuilding: Building = { ...bldData, id: `bld-${Date.now()}` };
    setBuildings((prev) => [newBuilding, ...prev]);
  };

  const updateBuilding = (updated: Building) => {
    setBuildings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    if (selectedBuilding.id === updated.id) setSelectedBuilding(updated);
  };

  const deleteBuilding = (id: string) => {
    setBuildings((prev) => prev.filter((b) => b.id !== id));
  };

  const addBlock = (blockData: Omit<Block, 'id'>) => {
    const newBlock: Block = { ...blockData, id: `blk-${Date.now()}` };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (updated: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    if (selectedBlock.id === updated.id) setSelectedBlock(updated);
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const addFloor = (floorData: Omit<Floor, 'id'>) => {
    const newFloor: Floor = { ...floorData, id: `flr-${Date.now()}` };
    setFloors((prev) => [...prev, newFloor]);
  };

  const updateFloor = (updated: Floor) => {
    setFloors((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    if (selectedFloor.id === updated.id) setSelectedFloor(updated);
  };

  const deleteFloor = (id: string) => {
    setFloors((prev) => prev.filter((f) => f.id !== id));
  };

  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = { ...roomData, id: `rm-${Date.now()}` };
    setRooms((prev) => [...prev, newRoom]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'room_added',
        title: 'New room added',
        subtitle: `${selectedBlock.name} · ${selectedFloor.name} · ${newRoom.name}`,
        timestamp: 'Just now',
        user: currentUser.name,
      },
      ...prev,
    ]);
  };

  const updateRoom = (updated: Room) => {
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const addFacility = (facilityData: Omit<Facility, 'id'>) => {
    const newFac: Facility = { ...facilityData, id: `fac-${Date.now()}` };
    setFacilities((prev) => [...prev, newFac]);
  };

  const updateFacility = (updated: Facility) => {
    setFacilities((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const deleteFacility = (id: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id));
  };

  const addNode = (nodeData: Omit<MapNode, 'id'>) => {
    const newNode: MapNode = { ...nodeData, id: `node-${Date.now()}` };
    setNodes((prev) => [...prev, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id'>) => {
    const newUser: AdminUser = { ...userData, id: `u-${Date.now()}` };
    setAdminUsers((prev) => [...prev, newUser]);
  };

  const updateAdminUser = (updated: AdminUser) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setUserView('home');
    localStorage.removeItem('pathly_current_user');
  };

  return (
    <AppContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        userView,
        setUserView,
        adminView,
        setAdminView,
        selectedCollege,
        setSelectedCollege,
        selectedBuilding,
        setSelectedBuilding,
        selectedBlock,
        setSelectedBlock,
        selectedFloor,
        setSelectedFloor,
        selectedRoom,
        setSelectedRoom,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        colleges,
        buildings,
        blocks,
        floors,
        rooms,
        facilities,
        nodes,
        edges,
        adminUsers,
        activities,
        analytics,
        savedRoomIds,
        toggleSaveRoom,
        isRoomSaved,
        isNavigating,
        activeRoute,
        currentStepIndex,
        setCurrentStepIndex,
        isSimulatingWalk,
        startNavigationToRoom,
        startNavigationToFacility,
        stopNavigation,
        startWalkingSimulation,
        pauseWalkingSimulation,
        recalculateRoute,
        addCollege,
        updateCollege,
        deleteCollege,
        addBuilding,
        updateBuilding,
        deleteBuilding,
        addBlock,
        updateBlock,
        deleteBlock,
        addFloor,
        updateFloor,
        deleteFloor,
        addRoom,
        updateRoom,
        deleteRoom,
        addFacility,
        updateFacility,
        deleteFacility,
        addNode,
        deleteNode,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        theme,
        setTheme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
