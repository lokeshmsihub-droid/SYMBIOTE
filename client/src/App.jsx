import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './layouts/Layout';

// Public Pages
import Login from './pages/Auth/LoginPage';
import Register from './pages/Auth/RegisterPage';
import NotFound from './pages/NotFound';

// Core Application Pages
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Streaks from './pages/Streaks';
import Rewards from './pages/Rewards';
import Wallet from './pages/Wallet';
import Community from './pages/Community';
import Mentorship from './pages/Mentorship';
import Mystery from './pages/Mystery';
import Story from './pages/Story';
import Goals from './pages/Goals';
import Wellness from './pages/Wellness';
import Accountability from './pages/Accountability';
import Sergeants from './pages/Sergeants';

// Admin Only Pages
import Analytics from './pages/Analytics';
import AdminJira from './pages/AdminJira';

const RootRedirector = () => {
  const { hasCapability, loading } = useAuth();
  if (loading) return null; // Let the global router loader handle it
  return hasCapability('view_admin_dashboard') 
    ? <Navigate to="/admin/dashboard" replace /> 
    : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth / Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Global Protected App Shell */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route element={<Layout />}>
            {/* Intelligent Root Routing */}
            <Route index element={<RootRedirector />} />
            
            {/* Explicit Dashboards */}
            <Route path="dashboard" element={<UserDashboard />} />
            <Route 
               path="admin/dashboard" 
               element={
                 <ProtectedRoute allowedRoles={['ADMIN']}>
                   <AdminDashboard />
                 </ProtectedRoute>
               } 
            />
            
            {/* Core User Experience */}
            <Route path="challenges" element={<Challenges />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="streaks" element={<Streaks />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="community" element={<Community />} />
            <Route path="mentorship" element={<Mentorship />} />
            
            {/* Exploration & Culture */}
            <Route path="mystery" element={<Mystery />} />
            <Route path="story" element={<Story />} />
            <Route path="goals" element={<Goals />} />
            <Route path="wellness" element={<Wellness />} />
            <Route path="accountability" element={<Accountability />} />
            <Route path="sergeants" element={<Sergeants />} />
            
            {/* Higher Intelligence (Admin Only within App Shell) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="analytics" element={<Analytics />} />
              <Route path="admin/jira" element={<AdminJira />} />
            </Route>
          </Route>
        </Route>

        {/* 404 - Not Found (Production Grade Handling) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
