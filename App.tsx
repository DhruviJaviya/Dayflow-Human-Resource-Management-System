
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMSProvider } from './context/HRMSContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import TimeOffPage from './pages/TimeOffPage';
import { User, UserRole } from './types';

const NavigationHandler: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700 mb-4"></div>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Portal...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!isAuthenticated) {
      if (currentPage === 'forgot-password') return <ForgotPassword onNavigate={setCurrentPage} />;
      return <Login onNavigate={setCurrentPage} />;
    }

    if (currentPage === 'profile') {
      return <ProfilePage user={user!} />;
    }

    if (currentPage === 'view-employee' && selectedEmployee) {
      return <ProfilePage user={selectedEmployee} readOnly={user?.role !== UserRole.ADMIN} />;
    }

    if (currentPage === 'attendance') {
      return <AttendancePage />;
    }

    if (currentPage === 'time-off') {
      return <TimeOffPage />;
    }

    if (currentPage === 'employees' && user?.role === UserRole.ADMIN) {
      return <AdminDashboard onSelectEmployee={(emp) => {
        setSelectedEmployee(emp);
        setCurrentPage('view-employee');
      }} />;
    }

    if (user?.role === UserRole.ADMIN) return <AdminDashboard onSelectEmployee={(emp) => {
        setSelectedEmployee(emp);
        setCurrentPage('view-employee');
      }} />;
    return <EmployeeDashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar onNavigate={setCurrentPage} />
      {renderContent()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HRMSProvider>
        <NavigationHandler />
      </HRMSProvider>
    </AuthProvider>
  );
};

export default App;
