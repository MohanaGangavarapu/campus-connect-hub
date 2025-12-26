// Type definitions for Smart Campus application

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

// Student profile type
export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  email: string;
  semester: number;
}

// Attendance record type
export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: 'present' | 'absent';
}

// Outing request type
export interface OutingRequest {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Announcement type
export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

// Login response type
export interface LoginResponse {
  token: string;
  user: User;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
}
