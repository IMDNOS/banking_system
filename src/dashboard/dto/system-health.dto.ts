export class SystemHealthDto {
  uptime: number;
  memory: NodeJS.MemoryUsage;
  timestamp: string;
  db: 'UP' | 'DOWN';
}
