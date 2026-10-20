import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  Camera,
  CarFront,
  ChevronDown,
  Compass,
  Cpu,
  Fence,
  FileText,
  Flame,
  Footprints,
  HeartPulse,
  LayoutDashboard,
  Lock,
  Map,
  Menu,
  Monitor,
  Network,
  Radio,
  Settings,
  Shield,
  Users,
  Video,
  WifiOff
} from 'lucide-react';
import { useEffect,useState } from 'react';
import { Link,Outlet,useLocation } from 'react-router-dom';

interface NavSection {
  title: string;
  items: {
    path: string;
    icon: any;
    label: string;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'COMMAND & TACTICAL',
    items: [
      { path: '/command-center', icon: LayoutDashboard, label: 'Command Center' },
      { path: '/surveillance', icon: Monitor, label: 'Live Surveillance', badge: 'LIVE' },
      { path: '/map', icon: Map, label: 'Map Intelligence' },
      { path: '/heatmap', icon: Flame, label: 'Surveillance Heatmap', badge: 'NEW' },
    ]
  },
  {
    title: 'INTELLIGENCE & AI',
    items: [
      { path: '/tracking', icon: Footprints, label: 'Objects & Tracking' },
      { path: '/tracking/cross-camera', icon: Compass, label: 'Cross-Camera Re-ID', badge: 'AI' },
      { path: '/anpr', icon: CarFront, label: 'ANPR Vehicle Intel' },
      { path: '/virtual-fences', icon: Fence, label: 'Virtual Fences' },
      { path: '/video-analyzer', icon: Video, label: 'Video Forensics', badge: 'NEW' },
      { path: '/analytics', icon: BarChart3, label: 'Analytics Hub' },
    ]
  },
  {
    title: 'SECURITY & OPERATIONS',
    items: [
      { path: '/security', icon: Shield, label: 'Security Center' },
      { path: '/integrations', icon: Network, label: 'Integrations' },
      { path: '/alerts', icon: Bell, label: 'Threat Alerts' },
      { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
      { path: '/evidence', icon: Archive, label: 'Evidence Vault' },
      { path: '/audit-log', icon: FileText, label: 'System Audit Log' },
    ]
  },
  {
    title: 'INFRASTRUCTURE & SYSTEM',
    items: [
      { path: '/cameras', icon: Camera, label: 'Camera Registry' },
      { path: '/camera-health', icon: HeartPulse, label: 'Camera Diagnostics' },
      { path: '/ai-models', icon: Cpu, label: 'AI Model Center', badge: 'NEW' },
      { path: '/system-health', icon: Activity, label: 'System Health' },
      { path: '/users', icon: Users, label: 'Users & Roles (RBAC)' },
      { path: '/settings', icon: Settings, label: 'Settings & Tuning' },
    ]
  }
];

const allNavItems = navSections.flatMap(s => s.items);

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const networkStatus = useAppStore((state) => state.networkStatus);
  const location = useLocation();
  const [timeStr, setTimeStr] = useState('');
  const [activeSector, setActiveSector] = useState('Sector 04 - North Border');
  const [sectorOpen, setSectorOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(new Date());
      setTimeStr(`${formatted} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setSectorOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileNavOpen]);

  const currentNav = allNavItems.find(item =>
    location.pathname === item.path || (item.path !== '/command-center' && location.pathname.startsWith(item.path))
  );

  return (
    <div className="flex h-screen h-[100dvh] bg-[#070B12] text-slate-100 overflow-hidden font-sans">
      {/* ── TACTICAL MILITARY SIDEBAR ── */}
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside
        id="primary-navigation"
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0F18] border-r border-[#1B2536] flex flex-col flex-shrink-0 shadow-2xl transform transition-transform duration-200 md:static md:z-20 md:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="px-3 py-2 border-b border-[#1B2536] bg-[#070B12]/80 backdrop-blur-md">
          <Link to="/command-center" className="block w-full overflow-hidden rounded-md" aria-label="IBVAP home">
            <img src="/ibvap-logo.png" alt="IBVAP — Border Video Intelligence" className="block w-full aspect-[3.04] object-cover" />
          </Link>
        </div>

        {/* Categorized Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2 px-2.5 space-y-3.5 custom-scrollbar">
          {navSections.map((sec, sIdx) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center justify-between">
                <span>{sec.title}</span>
                {sIdx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
              </div>

              <nav className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/command-center' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-400 font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#121926]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                        <span className="text-xs tracking-tight">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                          item.badge === 'LIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                          item.badge === 'AI' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User / Clearance Footer */}
        <div className="p-3 border-t border-[#1B2536] bg-[#070B12]/90 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#0F1726] border border-[#1E293B]">
            <div className="relative w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xs shadow">
              {user?.username?.charAt(0).toUpperCase() || 'C'}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F1726]" />
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.fullName || user?.username || 'Commander 1'}</p>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">LVL-4 CLEARANCE</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/20 font-mono transition-colors"
          >
            <Lock size={12} /> Sign Out Session
          </button>

          {/* Indian Border Security Intelligence Graphic */}
          <div className="rounded-lg overflow-hidden border border-[#1B2536]/80 relative h-14 bg-black/40">
            <img
              src="/bg-surveillance.jpg"
              alt="Border Security"
              className="w-full h-full object-cover opacity-75"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA WITH UNIFIED TOP HEADER ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-[#070B12]">

        {/* Unified Military Top Bar with Skyline Background */}
        <header className="h-14 relative px-3 sm:px-5 flex items-center justify-between flex-shrink-0 z-10 overflow-hidden border-b border-[#1B2536]">
          {/* Panoramic Skyline Backdrop */}
          <img
            src="/bg-operations.jpg"
            alt="Border Defense Skyline"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40 z-0"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F18]/95 via-[#0A0F18]/85 to-[#0A0F18]/90 backdrop-blur-sm pointer-events-none z-[1]" />

          <div className="relative z-10 flex items-center justify-between w-full">
            {/* Left: Sector Selector & Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#1E293B] bg-[#0F1726]/90 text-slate-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Open navigation menu"
                aria-expanded={mobileNavOpen}
                aria-controls="primary-navigation"
              >
                <Menu size={18} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setSectorOpen(!sectorOpen)}
                  className="flex max-w-[38vw] sm:max-w-none items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-[#0F1726]/90 border border-[#1E293B] hover:border-emerald-500/40 text-xs font-mono text-slate-200 transition-colors shadow-sm"
                  aria-expanded={sectorOpen}
                  aria-haspopup="menu"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white tracking-wide truncate">{activeSector}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {sectorOpen && (
                  <div role="menu" className="absolute left-0 mt-1.5 w-60 max-w-[calc(100vw-3rem)] bg-[#0E1624] border border-[#1E293B] rounded-lg shadow-2xl py-1 z-50 text-xs font-mono">
                    {['Sector 04 - North Border', 'Sector 02 - Western Corridor', 'Sector 01 - Riverine Outpost', 'Sector 07 - High Altitude Pass'].map((sec) => (
                      <button
                        type="button"
                        role="menuitem"
                        key={sec}
                        onClick={() => { setActiveSector(sec); setSectorOpen(false); }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between ${activeSector === sec ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'}`}
                      >
                        <span>{sec}</span>
                        {activeSector === sec && <span className="text-[10px] text-emerald-400">ACTIVE</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                DEFCON 3 // ELEVATED THREAT
              </div>

              <div className="hidden xl:flex items-center text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
                <span className="text-slate-500">MODULE :</span>
                <span className="ml-1.5 text-cyan-400 font-bold uppercase tracking-wider">{currentNav?.label || 'COMMAND CENTER'}</span>
              </div>
            </div>

            {/* Right: Realtime Clocks, Operational Status, Quick Actions */}
            <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-3 font-mono text-xs">
              {/* Live Clock */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1726]/90 border border-[#1E293B] text-slate-300 shadow-sm">
                <Radio size={14} className="text-cyan-400 animate-pulse" />
                <span className="font-semibold text-slate-200">{timeStr || '—'}</span>
              </div>

              {/* Operational Beacon */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-bold ${networkStatus === 'online' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-red-950/60 border-red-500/40 text-red-300'}`}
                role="status"
                aria-live="polite"
                title="API connection status"
              >
                {networkStatus === 'offline' ? <WifiOff size={13} /> : <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                <span>API {networkStatus.toUpperCase()}</span>
              </div>

              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>OPERATIONAL</span>
              </div>

              {/* Quick Alerts Link */}
              <Link
                to="/alerts"
                className="relative p-2 rounded-lg bg-[#0F1726]/90 border border-[#1E293B] text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors shadow-sm"
                title="Threat Alerts"
              >
                <Bell size={15} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center border border-[#0A0F18]">
                  3
                </span>
              </Link>

              {/* Quick Multi-Wall Link */}
              <Link
                to="/surveillance"
                className="hidden md:flex p-2 rounded-lg bg-[#0F1726]/90 border border-[#1E293B] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-sm"
                title="Surveillance Wall"
              >
                <Monitor size={15} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 min-h-0 min-w-0 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
