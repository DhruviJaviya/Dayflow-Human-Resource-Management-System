
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { calculateSalaryComponents } from '../utils/salaryUtils';

interface ProfilePageProps {
  user: User;
  onUpdate?: (user: User) => void;
  readOnly?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, readOnly = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'private' | 'salary'>('overview');
  const [localUser, setLocalUser] = useState<User>(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleWageChange = (wage: number) => {
    const updated = { ...localUser, salary: calculateSalaryComponents(wage) };
    setLocalUser(updated);
    if (onUpdate) onUpdate(updated);
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 font-black text-xs uppercase tracking-widest transition-all ${
        activeTab === id ? 'text-indigo-700 border-b-4 border-indigo-700' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="pt-20 pb-10 px-8 bg-[#000000] mx-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden mb-10">
        <div className="h-40 bg-indigo-900 relative">
          <div className="absolute -bottom-16 left-12 p-2 bg-white rounded-3xl shadow-xl">
            <div className="w-32 h-32 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl font-black text-indigo-700">
              {localUser.fullName.charAt(0)}
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-12 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{localUser.fullName}</h1>
              <p className="text-indigo-600 font-black tracking-widest uppercase text-xs mt-1">{localUser.role} • {localUser.loginId}</p>
              <div className="mt-4 flex gap-4 text-sm text-gray-500 font-bold">
                <span>📍 {localUser.location || 'Undefined Location'}</span>
                <span>📧 {localUser.email}</span>
              </div>
            </div>
            {!readOnly && (
              <button className="bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-800 transition-all shadow-lg">Save Profile</button>
            )}
          </div>
        </div>

        <div className="border-b border-gray-100 px-12 flex gap-4">
          <TabButton id="overview" label="Overview" />
          <TabButton id="resume" label="Resume" />
          <TabButton id="private" label="Private Info" />
          <TabButton id="salary" label="Salary Info" />
        </div>

        <div className="p-12">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-[#312E81] uppercase tracking-widest">Work Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Department</p>
                    <p className="font-bold text-gray-800">{localUser.department || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Location</p>
                    <p className="font-bold text-gray-800">{localUser.location || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl col-span-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Reports To</p>
                    <p className="font-bold text-gray-800">{localUser.manager || 'No direct manager'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-black text-[#312E81] uppercase tracking-widest">Employee Stats</h3>
                <div className="p-6 border-2 border-indigo-50 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                    <p className="font-black text-green-600">ACTIVE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Joined In</p>
                    <p className="font-black text-gray-800">{localUser.joiningYear}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Skills & Competencies</h3>
                <div className="flex flex-wrap gap-3">
                  {localUser.skills.map((s, i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm border border-indigo-100">#{s}</span>
                  ))}
                  {!readOnly && <button className="px-4 py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-400 transition-all">+ Add Skill</button>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localUser.certifications.map((c, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🏆</div>
                      <p className="font-bold text-gray-800">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'private' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-4">
                <h4 className="font-black text-gray-800">Personal Details</h4>
                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">DOB</span>
                    <span className="text-sm font-bold">{localUser.dob || '01-01-1990'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Gender</span>
                    <span className="text-sm font-bold">{localUser.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">Nationality</span>
                    <span className="text-sm font-bold">{localUser.nationality || 'Indian'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-gray-800">Banking & Identification</h4>
                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Employee Code</span>
                    <span className="text-sm font-bold text-indigo-600">{localUser.loginId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">Bank Account</span>
                    <span className="text-sm font-bold">•••• •••• {localUser.bankDetails?.accountNumber.slice(-4) || '1234'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">Compensation Package</h3>
                {!readOnly ? (
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400">EDIT WAGE:</span>
                    <input 
                      type="number"
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-32 font-bold"
                      value={localUser.salary?.wage}
                      onChange={(e) => handleWageChange(Number(e.target.value))}
                    />
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Monthly CTC</p>
                    <p className="text-2xl font-black text-indigo-700">₹{localUser.salary?.wage.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-300 uppercase tracking-widest">Earnings Breakdown</h4>
                  <div className="space-y-3">
                    {[
                      ['Basic Pay (50%)', localUser.salary?.basic],
                      ['House Rent Allowance', localUser.salary?.hra],
                      ['Standard Allowance', localUser.salary?.standardAllowance],
                      ['Performance Bonus', localUser.salary?.performanceBonus],
                      ['LTA', localUser.salary?.lta],
                      ['Fixed Allowance', localUser.salary?.fixedAllowance]
                    ].map(([label, val]) => (
                      <div key={label as string} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-bold text-gray-600">{label}</span>
                        <span className="text-sm font-black text-gray-900">₹{Number(val).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-300 uppercase tracking-widest">Deductions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-sm font-bold text-red-700">Provident Fund (12%)</span>
                      <span className="text-sm font-black text-red-700">-₹{localUser.salary?.pf.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-sm font-bold text-red-700">Professional Tax</span>
                      <span className="text-sm font-black text-red-700">-₹{localUser.salary?.pt.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-indigo-900 rounded-3xl text-white shadow-xl">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Estimated In-Hand Salary</p>
                    <h5 className="text-3xl font-black">₹{((localUser.salary?.wage || 0) - (localUser.salary?.pf || 0) - (localUser.salary?.pt || 0)).toLocaleString()}</h5>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
