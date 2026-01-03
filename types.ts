
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // ISO string
  checkOut?: string; // ISO string
  status: AttendanceStatus;
}

export type TimeOffType = 'PAID' | 'SICK';
export type TimeOffStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TimeOffRequest {
  id: string;
  userId: string;
  employeeName: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  status: TimeOffStatus;
  reason: string;
  attachment?: string; // Base64 or URL
  submittedAt: string;
}

export interface SalaryInfo {
  wage: number;
  basic: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  pf: number;
  pt: number;
}

export interface User {
  id: string;
  loginId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  joiningYear: number;
  isFirstLogin: boolean;
  password?: string;
  status: 'ACTIVE' | 'INACTIVE';
  attendanceStatus: AttendanceStatus;
  lastCheckIn?: string;
  
  // Profile Data
  department?: string;
  manager?: string;
  location?: string;
  skills: string[];
  certifications: string[];
  hobbies: string[];
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
  nationality?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    pan: string;
    uan: string;
  };
  salary?: SalaryInfo;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
