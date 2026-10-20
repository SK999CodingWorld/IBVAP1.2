import { Button } from '@/components/ui/Button';
import { createCamera,filterCameras,initialCameraList,type CameraItem } from '@/features/cameras/management';
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Crosshair,
  Edit2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Video,
  X,
  XCircle
} from 'lucide-react';
import React,{ useState } from 'react';

export const CameraManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cameraList, setCameraList] = useState<CameraItem[]>(initialCameraList);
  const [editingCamera, setEditingCamera] = useState<CameraItem | null>(null);
  const [form, setForm] = useState({ id: '', name: '', location: '' });
  const [notice, setNotice] = useState('');

  const openCameraForm = (camera?: CameraItem) => {
    setEditingCamera(camera ?? null);
    setForm(camera ? { id: camera.id, name: camera.name, location: camera.location } : { id: '', name: '', location: '' });
    setShowModal(true);
  };

  const saveCamera = (event: React.FormEvent) => {
    event.preventDefault();
    const id = form.id.trim();
    const name = form.name.trim();
    const location = form.location.trim();
    if (editingCamera) {
      setCameraList(items => items.map(camera => camera.id === editingCamera.id ? { ...camera, id, name, location } : camera));
      setNotice(`${id} configuration saved locally.`);
    } else {
      try {
        const newCamera = createCamera({ id, name, location }, cameraList);
        setCameraList(items => [newCamera, ...items]);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Unable to create camera.');
        return;
      }
      setNotice(`${id} added to the local camera list.`);
    }
    setShowModal(false);
  };

  const filtered = filterCameras(cameraList, searchTerm);

  return (
    <div className="h-full flex flex-col bg-[#070B12] text-slate-200 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar">

      {/* ── TOP OPERATIONAL HEADER BAR WITH WATCHTOWER BACKGROUND ── */}
      <div
        className="p-4 bg-[#0A0F18] border border-[#1B2536] rounded-xl flex flex-wrap gap-4 justify-between items-center relative overflow-hidden shadow-xl"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 15, 24, 0.98) 45%, rgba(10, 15, 24, 0.45) 80%, rgba(10, 15, 24, 0.2) 100%), url('/bg-surveillance.jpg')`,
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
      >
        <div className="flex items-center space-x-3 z-10">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/40">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono">
              Camera Management
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Manage and configure connected surveillance devices
            </p>
          </div>
        </div>

        <div className="z-10 font-mono text-xs">
          <Button
            size="sm"
            onClick={() => openCameraForm()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/40 border border-cyan-400/30 transition-colors h-8 px-3 rounded-lg"
          >
            <Plus size={14} /> Add Camera
          </Button>
        </div>
      </div>

      {notice && <div role="status" className="text-xs text-cyan-300">{notice}<button className="ml-3 underline" onClick={() => setNotice('')}>Dismiss</button></div>}

      {/* ── 4 KPI STATS CARDS MATCHING SCREENSHOT ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

        {/* Total Cameras */}
        <div
          className="relative bg-[#0A0F18] border border-cyan-500/30 hover:border-cyan-500/60 rounded-xl p-3.5 shadow-xl overflow-hidden group transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(10, 15, 24, 0.92) 50%, rgba(10, 15, 24, 0.3) 100%), url('/bg-surveillance.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-inner">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-none">142</div>
                <div className="text-xs text-slate-400 font-mono mt-1">Total Cameras</div>
              </div>
            </div>
          </div>
        </div>

        {/* Online Cameras */}
        <div
          className="relative bg-[#0A0F18] border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-3.5 shadow-xl overflow-hidden group transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(10, 15, 24, 0.92) 50%, rgba(10, 15, 24, 0.3) 100%), url('/bg-operations.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-none">128</div>
                <div className="text-xs text-slate-400 font-mono mt-1">Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Degraded Cameras */}
        <div
          className="relative bg-[#0A0F18] border border-amber-500/30 hover:border-amber-500/60 rounded-xl p-3.5 shadow-xl overflow-hidden group transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(10, 15, 24, 0.92) 50%, rgba(10, 15, 24, 0.3) 100%), url('/bg-analytics.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-none">9</div>
                <div className="text-xs text-slate-400 font-mono mt-1">Degraded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Cameras */}
        <div
          className="relative bg-[#0A0F18] border border-red-500/30 hover:border-red-500/60 rounded-xl p-3.5 shadow-xl overflow-hidden group transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(10, 15, 24, 0.92) 50%, rgba(10, 15, 24, 0.3) 100%), url('/bg-operations.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 shadow-inner">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono leading-none">5</div>
                <div className="text-xs text-slate-400 font-mono mt-1">Offline</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── SEARCH & RADAR BANNER ── */}
      <div
        className="p-3 bg-[#0A0F18] border border-[#1B2536] rounded-xl flex items-center justify-between shadow-xl relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 15, 24, 0.98) 40%, rgba(10, 15, 24, 0.45) 80%, rgba(10, 15, 24, 0.15) 100%), url('/bg-analytics.jpg')`,
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
      >
        <div className="relative w-72 sm:w-80 z-10">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search cameras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070B12] border border-[#1E293B] rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-500 text-slate-200 font-mono"
          />
        </div>

        <div className="z-10 pr-2 hidden sm:block">
          <Crosshair className="w-5 h-5 text-cyan-500/60" />
        </div>
      </div>

      {/* ── CAMERA DATA TABLE ── */}
      <div className="bg-[#0A0F18] border border-[#1B2536] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070B12] text-slate-400 uppercase text-[11px] border-b border-[#1B2536]">
              <tr>
                <th className="px-5 py-3 font-semibold">CAMERA ID & NAME</th>
                <th className="px-4 py-3 font-semibold">LOCATION</th>
                <th className="px-4 py-3 font-semibold">STATUS</th>
                <th className="px-4 py-3 font-semibold">SPECS</th>
                <th className="px-4 py-3 font-semibold">ZONE</th>
                <th className="px-4 py-3 font-semibold">HEALTH</th>
                <th className="px-5 py-3 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2536]">
              {filtered.map((cam, idx) => (
                <tr key={idx} className="hover:bg-[#0E1624]/60 transition-colors group">

                  {/* Camera ID, Thumbnail, and Name */}
                  <td className="px-5 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-14 h-9 rounded overflow-hidden bg-black/60 border border-[#1E293B] flex-shrink-0 group-hover:border-cyan-500/40 transition-colors">
                        <img
                          src={cam.thumb}
                          alt={cam.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/camera-perimeter.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{cam.id}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[130px]">{cam.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3 text-slate-300">
                    {cam.location}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      cam.status === 'online' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' :
                      cam.status === 'degraded' ? 'bg-amber-950/60 text-amber-400 border-amber-500/40' :
                      'bg-red-950/60 text-red-400 border-red-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        cam.status === 'online' ? 'bg-emerald-400 animate-pulse' :
                        cam.status === 'degraded' ? 'bg-amber-400' :
                        'bg-red-400'
                      }`} />
                      {cam.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Specs */}
                  <td className="px-4 py-3">
                    <div className="text-white font-semibold">{cam.res}</div>
                    <div className="text-[10px] text-slate-400">{cam.fps} FPS</div>
                  </td>

                  {/* Zone */}
                  <td className="px-4 py-3 text-slate-300">
                    {cam.zone}
                  </td>

                  {/* Health Bar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-[#070B12] rounded-full h-2 overflow-hidden border border-[#1E293B]">
                        <div
                          className={`h-full rounded-full ${
                            cam.health >= 90 ? 'bg-emerald-500' :
                            cam.health >= 60 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${cam.health}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-300 font-semibold">{cam.health}%</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2 text-slate-400">
                      <button
                        onClick={() => {
                          setCameraList(items => items.map(item => item.id === cam.id ? { ...item, status: 'online', fps: Math.max(item.fps, 24), health: Math.max(item.health, 90) } : item));
                          setNotice(`${cam.id} stream restart requested locally.`);
                        }}
                        className="p-1 hover:text-cyan-400 rounded transition-colors"
                        title="Sync / Restart Stream"
                        aria-label={`Restart ${cam.name} stream`}
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button
                        onClick={() => openCameraForm(cam)}
                        className="p-1 hover:text-amber-400 rounded transition-colors"
                        title="Edit Configuration"
                        aria-label={`Edit ${cam.name}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${cam.name} (${cam.id}) from this local list?`)) {
                            setCameraList(items => items.filter(item => item.id !== cam.id));
                            setNotice(`${cam.id} removed from the local camera list.`);
                          }
                        }}
                        className="p-1 hover:text-red-400 rounded transition-colors"
                        title="Delete Device"
                        aria-label={`Delete ${cam.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveCamera} className="bg-[#0A0F18] border border-[#1B2536] rounded-xl p-5 max-w-md w-full max-h-[90dvh] overflow-y-auto shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#1B2536] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus size={16} className="text-cyan-400" /> {editingCamera ? 'Edit Camera Configuration' : 'Add Surveillance Camera'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Camera Identifier</label>
                <input
                  type="text" value={form.id} onChange={e => setForm(current => ({ ...current, id: e.target.value }))} required disabled={!!editingCamera}
                  placeholder="e.g. BOP-04"
                  className="w-full bg-[#070B12] border border-[#1E293B] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Display Name</label>
                <input
                  type="text" value={form.name} onChange={e => setForm(current => ({ ...current, name: e.target.value }))} required
                  placeholder="e.g. Border Outpost 4 Night FOV"
                  className="w-full bg-[#070B12] border border-[#1E293B] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Location / Sector</label>
                <input
                  type="text" value={form.location} onChange={e => setForm(current => ({ ...current, location: e.target.value }))} required
                  placeholder="e.g. Sector 4 East Wing"
                  className="w-full bg-[#070B12] border border-[#1E293B] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Stream Protocol / RTSP URL</label>
                <input
                  type="text"
                  placeholder="rtsp://admin:pass@192.168.1.120:554/live"
                  className="w-full bg-[#070B12] border border-[#1E293B] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1B2536]">
              <Button type="button" size="sm" variant="outline" onClick={() => setShowModal(false)} className="border-[#1E293B] text-slate-300">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                {editingCamera ? 'Save Changes' : 'Add Camera'}
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CameraManagement;
