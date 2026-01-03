
import React, { useState } from 'react';
import { useHRMS } from '../context/HRMSContext';
import { User, UserRole } from '../types';
import { generateLoginId, validatePassword } from '../utils/authUtils';
import { calculateSalaryComponents } from '../utils/salaryUtils';

interface AdminDashboardProps {
  onSelectEmployee: (user: User) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectEmployee }) => {
  const { employees, updateEmployee } = useHRMS();
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: UserRole.EMPLOYEE,
    wage: 30000,
    password: ''
  });

  const filtered = employees.filter(e => 
    e.fullName.toLowerCase().includes(search.toLowerCase()) || 
    e.loginId.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const names = formData.fullName.trim().split(' ');
    const f2 = names[0] || 'US';
    const l2 = names.length > 1 ? names[names.length - 1] : 'ER';
    const year = new Date().getFullYear();
    const serial = employees.length + 1;
    const loginId = generateLoginId(f2, l2, year, serial);

    const newUser: User = {
      id: Date.now().toString(),
      loginId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      joiningYear: year,
      isFirstLogin: false,
      password: formData.password || 'Odoo@123',
      status: 'ACTIVE',
      attendanceStatus: 'ABSENT',
      salary: calculateSalaryComponents(formData.wage),
      skills: [],
      certifications: [],
      hobbies: []
    };

    updateEmployee(newUser);
    setShowAddForm(false);
  };

  return (
    <div className="pt-20 pb-10 px-8 bg-[#000000]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Employees</h1>
          <p className="text-gray-500 text-sm">Overview of all registered workforce</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-800 transition-all shadow-lg flex items-center gap-2"
        >
          <span>➕</span> Add Employee
        </button>
      </div>

      <div className="mb-8 max-w-xl">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name or Login ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(emp => (
          <div 
            key={emp.id}
            onClick={() => onSelectEmployee(emp)}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
              emp.attendanceStatus === 'PRESENT' ? 'bg-green-500' :
              emp.attendanceStatus === 'LEAVE' ? 'bg-blue-400' : 'bg-yellow-500'
            }`}></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-700 mb-4 group-hover:scale-110 transition-transform">
                {emp.fullName.charAt(0)}
              </div>
              <h3 className="font-black text-gray-900 truncate w-full">{emp.fullName}</h3>
              <p className="text-xs font-bold text-indigo-600 mb-2">{emp.loginId}</p>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{emp.department || 'No Dept'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{emp.role}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300">DETAILS</span>
              <span className="text-indigo-600 text-sm">→</span>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">New Employee Registration</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                placeholder="Full Name" required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
              <input 
                placeholder="Email Address" type="email" required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                placeholder="Phone Number" type="tel" required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <div className="flex gap-4">
                <select 
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.EMPLOYEE}>Employee</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
                <input 
                  placeholder="Monthly Wage" type="number" required 
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.wage}
                  onChange={e => setFormData({...formData, wage: Number(e.target.value)})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 shadow-md">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
