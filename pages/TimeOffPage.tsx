
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRMS } from '../context/HRMSContext';
import { UserRole, TimeOffRequest, TimeOffType, TimeOffStatus } from '../types';

const TimeOffPage: React.FC = () => {
  const { user } = useAuth();
  const { timeOffRequests, submitTimeOff, updateTimeOffStatus } = useHRMS();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Request State
  const [newRequest, setNewRequest] = useState({
    type: 'PAID' as TimeOffType,
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null as File | null
  });

  const isAdmin = user?.role === UserRole.ADMIN;

  // Allocation Logic
  const totalPaidAllocation = 24;
  const totalSickAllocation = 7;

  const filteredRequests = useMemo(() => {
    let requests = timeOffRequests;
    if (!isAdmin) {
      requests = requests.filter(r => r.userId === user?.id);
    }
    if (searchTerm) {
      requests = requests.filter(r => 
        r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return requests;
  }, [timeOffRequests, user?.id, isAdmin, searchTerm]);

  const paidRequests = filteredRequests.filter(r => r.type === 'PAID');
  const sickRequests = filteredRequests.filter(r => r.type === 'SICK');

  // Calculate remaining days for current user
  const remainingPaid = useMemo(() => {
    if (isAdmin) return totalPaidAllocation;
    const used = timeOffRequests
      .filter(r => r.userId === user?.id && r.type === 'PAID' && r.status === 'APPROVED')
      .reduce((acc, curr) => {
        const start = new Date(curr.startDate);
        const end = new Date(curr.endDate);
        const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        return acc + days;
      }, 0);
    return Math.max(0, totalPaidAllocation - used);
  }, [timeOffRequests, user?.id, isAdmin]);

  const remainingSick = useMemo(() => {
    if (isAdmin) return totalSickAllocation;
    const used = timeOffRequests
      .filter(r => r.userId === user?.id && r.type === 'SICK' && r.status === 'APPROVED')
      .reduce((acc, curr) => {
        const start = new Date(curr.startDate);
        const end = new Date(curr.endDate);
        const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        return acc + days;
      }, 0);
    return Math.max(0, totalSickAllocation - used);
  }, [timeOffRequests, user?.id, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newRequest.type === 'SICK' && !newRequest.attachment) {
      alert('Medical certificate attachment is mandatory for sick leave.');
      return;
    }

    const request: TimeOffRequest = {
      id: `to-${Date.now()}`,
      userId: user.id,
      employeeName: user.fullName,
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      status: 'PENDING',
      reason: newRequest.reason,
      attachment: newRequest.attachment ? newRequest.attachment.name : undefined,
      submittedAt: new Date().toISOString()
    };

    submitTimeOff(request);
    setShowAddForm(false);
    setNewRequest({ type: 'PAID', startDate: '', endDate: '', reason: '', attachment: null });
  };

  const RequestTable = ({ title, requests, allocationText }: { title: string, requests: TimeOffRequest[], allocationText: string }) => (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden mb-10">
      <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
        <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 px-4 py-2 rounded-full">{allocationText}</span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/20">
            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Date</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">End Date</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
            {isAdmin && <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {requests.length > 0 ? requests.map(req => (
            <tr key={req.id} className="hover:bg-gray-50/30 transition-all">
              <td className="px-8 py-4">
                <p className="font-bold text-gray-900 text-sm">{req.employeeName}</p>
                <p className="text-[10px] text-gray-400 font-bold">{req.reason}</p>
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-600">{req.startDate}</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-600">{req.endDate}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {req.status}
                </span>
              </td>
              {isAdmin && (
                <td className="px-8 py-4 text-right">
                  {req.status === 'PENDING' ? (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateTimeOffStatus(req.id, 'APPROVED')}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateTimeOffStatus(req.id, 'REJECTED')}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-300 uppercase italic">Processed</span>
                  )}
                </td>
              )}
            </tr>
          )) : (
            <tr><td colSpan={isAdmin ? 5 : 4} className="px-8 py-10 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">No requests found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="pt-24 pb-10 px-8 bg-[#000000] mx-auto">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Time Off</h1>
          {isAdmin && (
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
          )}
          {isAdmin && (
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full">Allocation Management</span>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-800 transition-all flex items-center gap-2"
          >
            <span>➕</span> Add New
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in duration-700">
        <RequestTable 
          title="Paid Time Off" 
          requests={paidRequests} 
          allocationText={isAdmin ? "24 Days Standard Yearly" : `${remainingPaid} Days Available`} 
        />
        <RequestTable 
          title="Sick Time Off" 
          requests={sickRequests} 
          allocationText={isAdmin ? "7 Days Standard Yearly" : `${remainingSick} Days Available`} 
        />
      </div>

      {/* Add Request Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Time Off Request</h2>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">SUBMITTING FOR: {user?.fullName}</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-gray-300 hover:text-gray-500 transition-colors text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Type of Leave</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewRequest({...newRequest, type: 'PAID'})}
                    className={`py-4 rounded-2xl font-bold transition-all border-2 ${newRequest.type === 'PAID' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    Paid Leave
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewRequest({...newRequest, type: 'SICK'})}
                    className={`py-4 rounded-2xl font-bold transition-all border-2 ${newRequest.type === 'SICK' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    Sick Leave
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Start Date</label>
                  <input 
                    type="date" required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700"
                    value={newRequest.startDate}
                    onChange={e => setNewRequest({...newRequest, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">End Date</label>
                  <input 
                    type="date" required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700"
                    value={newRequest.endDate}
                    onChange={e => setNewRequest({...newRequest, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Reason for Leave</label>
                <textarea 
                  required placeholder="Brief explanation..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 h-24 resize-none"
                  value={newRequest.reason}
                  onChange={e => setNewRequest({...newRequest, reason: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Attachment {newRequest.type === 'SICK' && <span className="text-red-500">* (Mandatory for Sick Leave)</span>}
                </label>
                <div className="relative border-2 border-dashed border-gray-100 rounded-2xl p-4 flex items-center justify-center bg-gray-50 hover:bg-white transition-all">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => setNewRequest({...newRequest, attachment: e.target.files ? e.target.files[0] : null})}
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-500">{newRequest.attachment ? newRequest.attachment.name : 'Drop file or click to upload'}</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest text-xs hover:text-gray-600 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOffPage;
