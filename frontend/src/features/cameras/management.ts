export interface CameraItem {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'degraded' | 'offline';
  res: string;
  fps: number;
  zone: string;
  health: number;
  thumb: string;
}

export const initialCameraList: CameraItem[] = [
  { id: 'BOP-01', name: 'BOP Main Gate', location: 'Sector 4', status: 'online', res: '1080p', fps: 30, zone: 'Red', health: 98, thumb: '/camera-perimeter.jpg' },
  { id: 'BOP-02', name: 'BOP Perimeter E', location: 'Sector 4', status: 'online', res: '1080p', fps: 30, zone: 'Red', health: 95, thumb: '/camera-checkpoint.jpg' },
  { id: 'BOP-03', name: 'BOP Perimeter W', location: 'Sector 4', status: 'online', res: '1080p', fps: 28, zone: 'Red', health: 88, thumb: '/camera-pedestrian.jpg' },
  { id: 'CHECK-01', name: 'Hwy Check Alpha', location: 'Highway 1', status: 'online', res: '4K', fps: 24, zone: 'Yellow', health: 92, thumb: '/camera-checkpoint.jpg' },
  { id: 'ROAD-01', name: 'Approach Rd N', location: 'Sector 2', status: 'online', res: '1080p', fps: 30, zone: 'Yellow', health: 99, thumb: '/bg-traffic.jpg' },
  { id: 'ROAD-02', name: 'Approach Rd S', location: 'Sector 2', status: 'degraded', res: '1080p', fps: 15, zone: 'Yellow', health: 65, thumb: '/camera-vehicle.jpg' },
  { id: 'GATE-01', name: 'Base Camp Entry', location: 'HQ Base Camp', status: 'online', res: '1080p', fps: 30, zone: 'Green', health: 100, thumb: '/camera-checkpoint.jpg' },
  { id: 'WATCH-01', name: 'Watchtower 7', location: 'Sector 5', status: 'offline', res: '4K', fps: 0, zone: 'Red', health: 0, thumb: '/bg-operations.jpg' },
];

export function filterCameras(cameras: CameraItem[], query: string): CameraItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return cameras;
  return cameras.filter(({ id, name, location }) =>
    [id, name, location].some(value => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
}

export function createCamera(input: Pick<CameraItem, 'id' | 'name' | 'location'>, cameras: CameraItem[]): CameraItem {
  const id = input.id.trim();
  const name = input.name.trim();
  const location = input.location.trim();
  if (!id || !name || !location) throw new Error('Camera ID, name, and location are required.');
  if (cameras.some(camera => camera.id.toLocaleLowerCase() === id.toLocaleLowerCase())) {
    throw new Error(`Camera ID ${id} already exists.`);
  }
  return { id, name, location, status: 'online', res: '1080p', fps: 30, zone: 'Unassigned', health: 100, thumb: '/camera-perimeter.jpg' };
}
