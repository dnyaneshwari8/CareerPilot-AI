import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import GuestRoute from './components/layout/GuestRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadResumePage from './pages/UploadResumePage';
import ResumeDetailsPage from './pages/ResumeDetailsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="upload" element={<UploadResumePage />} />
            <Route path="resume" element={<ResumeDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-strong !bg-surface-300 !text-slate-200 !border !border-white/10',
          duration: 4000,
        }}
      />
    </AuthProvider>
  );
}

export default App;
