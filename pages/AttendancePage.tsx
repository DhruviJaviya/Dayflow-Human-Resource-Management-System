
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRMS } from '../context/HRMSContext';
import { UserRole, AttendanceRecord } from '../types';

const AttendancePage: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const { markAttendance, employees, getAttendanceByDate, getAttendanceByMonth } = useHRMS();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dateStr = selectedDate.toISOString().split('T')[0];

  const handleCheckIn = () => {
    if (!user) return;
    setLoading(true);
    setTimeout(() => {
      markAttendance(user.id, 'PRESENT');
      refreshSession();
      setLoading(false);
    }, 600);
  };

  const handleCheckOut = () => {
    if (!user) return;
    setLoading(true);
    setTimeout(() => {
      markAttendance(user.id, 'ABSENT');
      refreshSession();
      setLoading(false);
    }, 600);
  };

  const calculateHours = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, diff / (1000 * 60 * 60));
  };

  const formatHours = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return `${hours}h ${mins}m`;
  };

  const navigateDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  // Monthly stats for current user
  const monthlyRecords = useMemo(() => {
    return getAttendanceByMonth(selectedDate.getFullYear(), selectedDate.getMonth(), isAdmin ? undefined : user?.id);
  }, [selectedDate, user?.id, employees, isAdmin]);

  const stats = useMemo(() => {
    const present = monthlyRecords.filter(r => r.status === 'PRESENT').length;
    const workingDays = monthlyRecords.length || 22; // Defaulting to 22 if no data
    return { present, leave: workingDays - present, total: workingDays };
  }, [monthlyRecords]);

  const filteredEmployees = useMemo(() => {
    if (!isAdmin) return [];
    return employees.filter(e => 
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.loginId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm, isAdmin]);

  const dailyRecords = useMemo(() => {
    return getAttendanceByDate(dateStr);
  }, [dateStr, employees]);

  return (
    <div className="pt-24 pb-10 px-8 bg-[#000000] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Attendance Management</h1>
          <p className="text-gray-500 font-bold text-xs">ROLE: {user?.role}</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'daily' ? 'bg-indigo-700 text-white' : 'text-gray-400 hover:text-indigo-600'}`}
          >
            Daily Log
          </button>
          <button 
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'monthly' ? 'bg-indigo-700 text-white' : 'text-gray-400 hover:text-indigo-600'}`}
          >
            Monthly Report
          </button>
        </div>
      </div>

      {/* Stats for Employee View */}
      {!isAdmin && viewMode === 'monthly' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-500">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Present Days</p>
            <p className="text-3xl font-black text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Leaves / Offs</p>
            <p className="text-3xl font-black text-red-500">{stats.leave}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Workings</p>
            <p className="text-3xl font-black text-indigo-700">{stats.total}</p>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigateDate(-1)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-indigo-50 text-indigo-700 font-bold transition-all">←</button>
          <div className="text-center min-w-[150px]">
            <p className="text-xs font-black text-indigo-600 uppercase">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <p className="font-black text-gray-900">{selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={() => navigateDate(1)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-indigo-50 text-indigo-700 font-bold transition-all">→</button>
        </div>

        {isAdmin && (
          <div className="flex-1 max-w-sm">
            <input 
              type="text" 
              placeholder="Search Employee..."
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <input 
            type="month" 
            className="px-4 py-2.5 rounded-xl bg-indigo-50 border-none text-indigo-700 font-black text-xs outline-none"
            value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-');
              setSelectedDate(new Date(parseInt(y), parseInt(m) - 1, 1));
            }}
          />
        </div>
      </div>

      {/* Dynamic Tables */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              {isAdmin ? (
                <>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-In</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-Out</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Work Hours</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Overtime</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                </>
              ) : (
                <>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-In</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-Out</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Work Hours</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isAdmin ? (
              // Admin View: List of employees for selected date
              filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => {
                  const rec = dailyRecords.find(r => r.userId === emp.id);
                  const totalHrs = calculateHours(rec?.checkIn, rec?.checkOut);
                  const overtime = Math.max(0, totalHrs - 9); // Standard shift is 9 hrs

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/30 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-700">
                            {emp.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{emp.fullName}</p>
                            <p className="text-[10px] font-bold text-gray-400">{emp.loginId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-600">
                        {rec?.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-600">
                        {rec?.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-indigo-700 text-center">
                        {formatHours(totalHrs)}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-green-600 text-center">
                        {overtime > 0 ? `+${formatHours(overtime)}` : '--'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          rec?.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {rec?.status || 'ABSENT'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-bold">No employees found</td></tr>
              )
            ) : (
              // Employee View: List of records for the month
              monthlyRecords.length > 0 ? (
                [...monthlyRecords].sort((a,b) => b.date.localeCompare(a.date)).map(rec => {
                  const totalHrs = calculateHours(rec.checkIn, rec.checkOut);
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50/30 transition-all">
                      <td className="px-8 py-5">
                        <p className="font-black text-gray-900 text-sm">{rec.date}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-600">
                        {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-600">
                        {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-indigo-700 text-center">
                        {formatHours(totalHrs)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          rec.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold">No attendance logs for this month</td></tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Action Float - Only for current user on today's date */}
      {!isAdmin && dateStr === new Date().toISOString().split('T')[0] && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-3xl shadow-2xl border border-indigo-100 flex items-center gap-6 z-[100] animate-in slide-in-from-bottom-10">
          <div className="text-left border-r pr-6 border-indigo-50">
            <p className="text-[10px] font-black text-indigo-400 uppercase">Today's Status</p>
            <p className={`font-black uppercase tracking-widest text-xs ${user?.attendanceStatus === 'PRESENT' ? 'text-green-600' : 'text-gray-400'}`}>
              {user?.attendanceStatus || 'OFFLINE'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleCheckIn}
              disabled={user?.attendanceStatus === 'PRESENT' || loading}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                user?.attendanceStatus === 'PRESENT' || loading ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
              }`}
            >
              {loading && user?.attendanceStatus !== 'PRESENT' ? '...' : 'Check In'}
            </button>
            <button 
              onClick={handleCheckOut}
              disabled={user?.attendanceStatus !== 'PRESENT' || loading}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                user?.attendanceStatus !== 'PRESENT' || loading ? 'bg-gray-100 text-gray-400' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200'
              }`}
            >
              {loading && user?.attendanceStatus === 'PRESENT' ? '...' : 'Check Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
