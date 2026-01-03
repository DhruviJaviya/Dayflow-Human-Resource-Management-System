
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isAuthenticated) return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-900 rounded flex items-center justify-center text-white font-bold">O</div>
        <span className="text-xl font-black text-indigo-900">ODOO</span>
      </div>
    </nav>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-8">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded flex items-center justify-center text-white font-bold">O</div>
          <span className="text-xl font-black text-indigo-900">ODOO</span>
        </button>
        
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate('employees')} className="text-sm font-bold text-gray-600 hover:text-indigo-900 uppercase tracking-wider">Employees</button>
          <button onClick={() => onNavigate('attendance')} className="text-sm font-bold text-gray-600 hover:text-indigo-900 uppercase tracking-wider">Attendance</button>
          <button onClick={() => onNavigate('time-off')} className="text-sm font-bold text-gray-600 hover:text-indigo-900 uppercase tracking-wider">Time Off</button>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="text-right mr-2">
          <p className="text-xs font-bold text-gray-900 uppercase">{user?.fullName}</p>
          <p className="text-[10px] text-indigo-600 font-bold">{user?.role}</p>
        </div>
        
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 bg-indigo-50 rounded-full border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold hover:bg-indigo-100 transition-all overflow-hidden"
        >
          {user?.fullName.charAt(0)}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-[60]">
            <button 
              onClick={() => { onNavigate('profile'); setShowDropdown(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              My Profile
            </button>
            <button 
              onClick={() => { logout(); setShowDropdown(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
