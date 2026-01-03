
import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="pt-24 pb-10 px-8 bg-[#000000] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-2">{greeting}, {user?.fullName.split(' ')[0]}!</h1>
        <p className="text-gray-500 font-medium">Welcome to your ODOO DayFlow workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">You're logged in as <br/><span className="text-indigo-300">{user?.role}</span></h2>
            <p className="text-indigo-100 mb-8 max-w-sm opacity-80">Track your attendance, manage your salary details, and keep your professional profile updated for better team collaboration.</p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl hover:scale-105 transition-all">Quick Check-In</button>
              <button className="px-6 py-3 bg-indigo-700/50 backdrop-blur text-white font-bold rounded-2xl hover:bg-indigo-700">View Policies</button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-700 mb-6">🗓️</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">My Attendance</h3>
            <p className="text-gray-500 text-sm mb-4">Current Status: <span className="text-indigo-600 font-bold">{user?.attendanceStatus}</span></p>
          </div>
          <button className="w-full py-4 border-2 border-indigo-50 rounded-2xl text-indigo-600 font-black hover:border-indigo-600 hover:bg-indigo-50 transition-all uppercase tracking-widest text-xs">
            Attendance Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
