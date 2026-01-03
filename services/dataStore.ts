
import { User, UserRole, AttendanceRecord, TimeOffRequest } from '../types';
import { calculateSalaryComponents } from '../utils/salaryUtils';

const INITIAL_USERS: User[] = [
  {
    id: '1',
    loginId: 'OIADMI20240001',
    fullName: 'System Admin',
    email: 'admin@odoo.com',
    phone: '9876543210',
    role: UserRole.ADMIN,
    joiningYear: 2024,
    isFirstLogin: false,
    password: 'AdminPassword123!',
    status: 'ACTIVE',
    attendanceStatus: 'PRESENT',
    department: 'Management',
    location: 'Mumbai, India',
    skills: ['Leadership', 'System Architecture', 'Security', 'Project Management'],
    certifications: ['PMP', 'CISSP', 'ITIL v4'],
    hobbies: ['Chess', 'Photography', 'Hiking'],
    salary: calculateSalaryComponents(150000),
    dob: '1985-05-15',
    gender: 'Male',
    nationality: 'Indian',
    bankDetails: {
      accountNumber: '987654321012',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0001234',
      pan: 'ABCDE1234F',
      uan: '100987654321'
    }
  },
  {
    id: '2',
    loginId: 'OIJODO20240002',
    fullName: 'John Doe',
    email: 'john.doe@odoo.com',
    phone: '9998887776',
    role: UserRole.EMPLOYEE,
    joiningYear: 2024,
    isFirstLogin: false,
    password: 'TempPass123!',
    status: 'ACTIVE',
    attendanceStatus: 'ABSENT',
    department: 'Engineering',
    manager: 'System Admin',
    location: 'Bangalore, India',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    certifications: ['AWS Cloud Practitioner', 'Oracle Java Professional'],
    hobbies: ['Coding', 'Gaming', 'Reading'],
    salary: calculateSalaryComponents(85000),
    dob: '1995-12-10',
    gender: 'Male',
    nationality: 'Indian',
    bankDetails: {
      accountNumber: '112233445566',
      bankName: 'ICICI Bank',
      ifsc: 'ICIC0005678',
      pan: 'FGHIJ5678K',
      uan: '100112233445'
    }
  },
  {
    id: '3',
    loginId: 'OISMWA20240003',
    fullName: 'Smith Walker',
    email: 'smith.walker@odoo.com',
    phone: '9123456780',
    role: UserRole.EMPLOYEE,
    joiningYear: 2024,
    isFirstLogin: false,
    password: 'Password123!',
    status: 'ACTIVE',
    attendanceStatus: 'PRESENT',
    department: 'Sales',
    manager: 'System Admin',
    location: 'Delhi, India',
    skills: ['Communication', 'B2B Sales', 'Negotiation'],
    certifications: ['Certified Sales Professional'],
    hobbies: ['Cricket', 'Travel'],
    salary: calculateSalaryComponents(65000),
    dob: '1992-08-20',
    gender: 'Male',
    nationality: 'Indian',
    bankDetails: {
      accountNumber: '998877665544',
      bankName: 'SBI Bank',
      ifsc: 'SBIN0001122',
      pan: 'KLMNO9012L',
      uan: '100998877665'
    }
  }
];

const INITIAL_TIMEOFF: TimeOffRequest[] = [
  {
    id: 'to-1',
    userId: '2',
    employeeName: 'John Doe',
    type: 'PAID',
    startDate: '2024-06-10',
    endDate: '2024-06-12',
    status: 'APPROVED',
    reason: 'Family vacation',
    submittedAt: new Date().toISOString()
  },
  {
    id: 'to-2',
    userId: '3',
    employeeName: 'Smith Walker',
    type: 'SICK',
    startDate: '2024-06-15',
    endDate: '2024-06-15',
    status: 'PENDING',
    reason: 'Fever and cold',
    attachment: 'medical_cert.pdf',
    submittedAt: new Date().toISOString()
  }
];

const USERS_KEY = 'odoo_hrms_db';
const ATTENDANCE_KEY = 'odoo_hrms_attendance';
const TIMEOFF_KEY = 'odoo_hrms_timeoff';

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id || u.loginId === user.loginId);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByLoginId = (loginId: string) => {
  return getUsers().find(u => u.loginId === loginId);
};

export const findUserByEmail = (email: string) => {
  return getUsers().find(u => u.email === email);
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  const stored = localStorage.getItem(ATTENDANCE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAttendanceRecord = (record: AttendanceRecord) => {
  const records = getAttendanceRecords();
  const index = records.findIndex(r => r.userId === record.userId && r.date === record.date);
  if (index !== -1) {
    records[index] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
};

export const getTimeOffRequests = (): TimeOffRequest[] => {
  const stored = localStorage.getItem(TIMEOFF_KEY);
  if (!stored) {
    localStorage.setItem(TIMEOFF_KEY, JSON.stringify(INITIAL_TIMEOFF));
    return INITIAL_TIMEOFF;
  }
  return JSON.parse(stored);
};

export const saveTimeOffRequest = (request: TimeOffRequest) => {
  const requests = getTimeOffRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
  } else {
    requests.push(request);
  }
  localStorage.setItem(TIMEOFF_KEY, JSON.stringify(requests));
};
