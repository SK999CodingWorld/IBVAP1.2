import { lazy,Suspense,useEffect,type ReactNode } from 'react';
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuthStore } from './stores/authStore';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));
const LiveSurveillance = lazy(() => import('./pages/LiveSurveillance'));
const CameraManagement = lazy(() => import('./pages/CameraManagement'));
const CameraHealth = lazy(() => import('./pages/CameraHealth'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const IncidentsPage = lazy(() => import('./pages/IncidentsPage').then((module) => ({ default: module.IncidentsPage })));
const PeopleObjects = lazy(() => import('./pages/PeopleObjects'));
const MultiCameraTracking = lazy(() => import('./pages/MultiCameraTracking'));
const ANPRPage = lazy(() => import('./pages/ANPRPage'));
const VirtualFences = lazy(() => import('./pages/VirtualFences'));
const MapIntelligence = lazy(() => import('./pages/MapIntelligence'));
const EvidenceVault = lazy(() => import('./pages/EvidenceVault'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'));
const UsersRoles = lazy(() => import('./pages/UsersRoles'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SystemHealth = lazy(() => import('./pages/SystemHealth').then((module) => ({ default: module.SystemHealth })));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AIModelCenter = lazy(() => import('./pages/AIModelCenter'));
const VideoAnalyzer = lazy(() => import('./pages/VideoAnalyzer'));
const SurveillanceHeatmap = lazy(() => import('./pages/SurveillanceHeatmap'));

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-950 text-slate-300" role="status">Loading view…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/command-center" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/surveillance" element={<LiveSurveillance />} />
          <Route path="/cameras" element={<CameraManagement />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/tracking" element={<PeopleObjects />} />
          <Route path="/people" element={<PeopleObjects />} />
          <Route path="/tracking/cross-camera" element={<MultiCameraTracking />} />
          <Route path="/cross-camera-tracking" element={<MultiCameraTracking />} />
          <Route path="/anpr" element={<ANPRPage />} />
          <Route path="/virtual-fences" element={<VirtualFences />} />
          <Route path="/fences" element={<VirtualFences />} />
          <Route path="/map" element={<MapIntelligence />} />
          <Route path="/evidence" element={<EvidenceVault />} />
          <Route path="/video-analyzer" element={<VideoAnalyzer />} />
          <Route path="/heatmap" element={<SurveillanceHeatmap />} />
          <Route path="/ai-models" element={<AIModelCenter />} />
          <Route path="/camera-health" element={<CameraHealth />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/system-health" element={<SystemHealth />} />
          <Route path="/security" element={<SecurityCenter />} />
          <Route path="/api-keys" element={<Navigate to="/security" replace />} />
          <Route path="/api-key" element={<Navigate to="/security" replace />} />
          <Route path="/integrations" element={<SecurityCenter initialTab="integrations" />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/users" element={<UsersRoles />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/command-center" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
