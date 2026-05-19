import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store/StoreContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ParchesPage from './pages/ParchesPage';
import ParcheDetailPage from './pages/ParcheDetailPage';
import CreatePlanPage from './pages/CreatePlanPage';
import PlanDetailPage from './pages/PlanDetailPage';

function AppRoutes() {
  const { currentUser } = useStore();

  if (!currentUser) return <AuthPage />;

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/parches" replace />} />
          <Route path="/parches" element={<ParchesPage />} />
          <Route path="/parches/:id" element={<ParcheDetailPage />} />
          <Route path="/parches/:id/create-plan" element={<CreatePlanPage />} />
          <Route path="/parches/:id/plans/:planId" element={<PlanDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/parches" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
