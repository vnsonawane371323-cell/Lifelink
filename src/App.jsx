import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterOrganization from './pages/RegisterOrganization';
import Donors from './pages/Donors';
import BloodRequests from './pages/BloodRequests';
import Notifications from './pages/Notifications';
import DonorMap from './pages/DonorMap';
import AdminDashboard from './pages/AdminDashboard';
import PredictionDashboard from './pages/PredictionDashboard';
import CitySelection from './pages/CitySelection';
import { useCity } from './contexts/CityContext';
import Dashboard from './dashboard/Dashboard';
import SectionPlaceholder from './dashboard/SectionPlaceholder';
import OrganizationLayout from './layouts/OrganizationLayout';
import OrgDashboard from './pages/organization/Dashboard';
import BloodRequestsPage from './pages/organization/BloodRequests';
import Volunteers from './pages/organization/Volunteers';
import NearbyDonorsPage from './pages/organization/NearbyDonorsPage';
import InviteVolunteers from './pages/organization/InviteVolunteers';
import JoinOrganization from './pages/JoinOrganization';

function RootRedirect() {
  const { selectedCity } = useCity();
  return <Navigate to={selectedCity ? '/dashboard' : '/select-city'} replace />;
}

function CityGuard({ children }) {
  const { selectedCity } = useCity();
  if (!selectedCity) {
    return <Navigate to="/select-city" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/select-city" element={<CitySelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join-organization" element={<JoinOrganization />} />
        <Route path="/register-organization" element={<RegisterOrganization />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CityGuard>
                <Dashboard />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/donors"
          element={
            <ProtectedRoute>
              <CityGuard>
                <Donors />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <CityGuard>
                <BloodRequests />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <CityGuard>
                <Notifications />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <CityGuard>
                <DonorMap />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/predictions"
          element={
            <ProtectedRoute>
              <CityGuard>
                <PredictionDashboard />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CityGuard>
                <AdminDashboard />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/org"
          element={
            <ProtectedRoute>
              <OrganizationLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrgDashboard />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="requests" element={<BloodRequestsPage />} />
          <Route path="nearby-donors" element={<NearbyDonorsPage />} />
          <Route path="invite" element={<InviteVolunteers />} />
          <Route path="settings" element={<SectionPlaceholder title="Settings" />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <CityGuard>
                <SectionPlaceholder title="Settings" />
              </CityGuard>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
