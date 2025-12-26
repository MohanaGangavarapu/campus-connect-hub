// API service using Axios for all backend communication
import axios from 'axios';
import type {
  LoginResponse,
  StudentProfile,
  AttendanceRecord,
  OutingRequest,
  Announcement,
} from '@/types';

// Base URL for API - change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (e.g., redirect on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH APIs ============

// Login user
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { email, password });
  return response.data;
};

// ============ PROFILE APIs ============

// Get current user's profile
export const getProfile = async (): Promise<StudentProfile> => {
  const response = await api.get<StudentProfile>('/profile');
  return response.data;
};

// ============ ATTENDANCE APIs ============

// Get attendance records for current student
export const getAttendance = async (): Promise<AttendanceRecord[]> => {
  const response = await api.get<AttendanceRecord[]>('/attendance');
  return response.data;
};

// Mark attendance (admin only)
export const markAttendance = async (
  studentId: string,
  date: string,
  subject: string,
  status: 'present' | 'absent'
): Promise<void> => {
  await api.post('/attendance', { studentId, date, subject, status });
};

// ============ OUTING APIs ============

// Get outing requests
export const getOutingRequests = async (): Promise<OutingRequest[]> => {
  const response = await api.get<OutingRequest[]>('/outing');
  return response.data;
};

// Create outing request (student)
export const createOutingRequest = async (
  reason: string,
  fromDate: string,
  toDate: string
): Promise<OutingRequest> => {
  const response = await api.post<OutingRequest>('/outing', { reason, fromDate, toDate });
  return response.data;
};

// Update outing request status (admin only)
export const updateOutingStatus = async (
  id: string,
  status: 'approved' | 'rejected'
): Promise<void> => {
  await api.put(`/outing/${id}`, { status });
};

// ============ ANNOUNCEMENT APIs ============

// Get all announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get<Announcement[]>('/announcements');
  return response.data;
};

// Create announcement (admin only)
export const createAnnouncement = async (
  title: string,
  content: string
): Promise<Announcement> => {
  const response = await api.post<Announcement>('/announcements', { title, content });
  return response.data;
};

// ============ ADMIN APIs ============

// Get all students (admin only)
export const getAllStudents = async (): Promise<StudentProfile[]> => {
  const response = await api.get<StudentProfile[]>('/students');
  return response.data;
};

export default api;
