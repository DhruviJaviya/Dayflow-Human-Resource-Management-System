
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AttendanceStatus, AttendanceRecord, TimeOffRequest, TimeOffStatus } from '../types';
import { 
  getUsers, 
  saveUser, 
  getAttendanceRecords, 
  saveAttendanceRecord, 
  getTimeOffRequests, 
  saveTimeOffRequest 
} from '../services/dataStore';

interface HRMSContextType {
  employees: User[];
  attendance: AttendanceRecord[];
  timeOffRequests: TimeOffRequest[];
  refreshEmployees: () => void;
  updateEmployee: (user: User) => void;
  markAttendance: (userId: string, status: AttendanceStatus) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getAttendanceByMonth: (year: number, month: number, userId?: string) => AttendanceRecord[];
  submitTimeOff: (request: TimeOffRequest) => void;
  updateTimeOffStatus: (requestId: string, status: TimeOffStatus) => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);

  const refreshEmployees = () => {
    setEmployees(getUsers());
    setAttendance(getAttendanceRecords());
    setTimeOffRequests(getTimeOffRequests());
  };

  useEffect(() => {
    refreshEmployees();
  }, []);

  const updateEmployee = (user: User) => {
    saveUser(user);
    refreshEmployees();
  };

  const markAttendance = (userId: string, status: AttendanceStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.attendanceStatus = status;
      user.lastCheckIn = status === 'PRESENT' ? now : undefined;
      saveUser(user);
    }

    const records = getAttendanceRecords();
    let record = records.find(r => r.userId === userId && r.date === today);
    
    if (!record) {
      record = {
        id: `${userId}-${today}`,
        userId,
        date: today,
        status,
        checkIn: status === 'PRESENT' ? now : undefined
      };
    } else {
      record.status = status;
      if (status === 'PRESENT' && !record.checkIn) record.checkIn = now;
      if (status === 'ABSENT' && record.checkIn) record.checkOut = now;
    }

    saveAttendanceRecord(record);
    refreshEmployees();
  };

  const getAttendanceByDate = (date: string) => {
    return attendance.filter(r => r.date === date);
  };

  const getAttendanceByMonth = (year: number, month: number, userId?: string) => {
    return attendance.filter(r => {
      const d = new Date(r.date);
      const match = d.getFullYear() === year && d.getMonth() === month;
      return userId ? match && r.userId === userId : match;
    });
  };

  const submitTimeOff = (request: TimeOffRequest) => {
    saveTimeOffRequest(request);
    refreshEmployees();
  };

  const updateTimeOffStatus = (requestId: string, status: TimeOffStatus) => {
    const requests = getTimeOffRequests();
    const req = requests.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      saveTimeOffRequest(req);
      refreshEmployees();
    }
  };

  return (
    <HRMSContext.Provider value={{ 
      employees, 
      attendance, 
      timeOffRequests,
      refreshEmployees, 
      updateEmployee, 
      markAttendance,
      getAttendanceByDate,
      getAttendanceByMonth,
      submitTimeOff,
      updateTimeOffStatus
    }}>
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) throw new Error('useHRMS must be used within HRMSProvider');
  return context;
};
