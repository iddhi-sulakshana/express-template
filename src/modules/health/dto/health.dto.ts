export type HealthReport = {
  status: 'OK' | 'DATABASE_ISSUE' | 'SERVER_ISSUE';
  message: string;
  timestamp: string;
  uptime: number;
  memoryUsage: {
    totalMemory: number;
    freeMemory: number;
    usedMemory: number;
  };
  cpuUsage: {
    user: number;
  };
  dependencies: {
    postgresql: {
      status: 'OK' | 'ISSUE';
      message: string;
    };
    redis: {
      status: 'OK' | 'ISSUE';
      message: string;
    };
    [key: string]: {
      status: 'OK' | 'ISSUE';
      message: string;
    };
  };
};
