// Admin Dashboard Page
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StudentsList from '@/components/admin/StudentsList';
import AttendanceMarker from '@/components/admin/AttendanceMarker';
import OutingRequestsAdmin from '@/components/admin/OutingRequestsAdmin';
import AnnouncementForm from '@/components/admin/AnnouncementForm';
import AnnouncementsList from '@/components/student/AnnouncementsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile, OutingRequest, Announcement } from '@/types';
import {
  getAllStudents,
  getOutingRequests,
  updateOutingStatus,
  getAnnouncements,
  createAnnouncement,
  markAttendance,
} from '@/services/api';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  // State for all data
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [outingRequests, setOutingRequests] = useState<OutingRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [studentsData, outingData, announcementsData] = await Promise.all([
          getAllStudents(),
          getOutingRequests(),
          getAnnouncements(),
        ]);

        setStudents(studentsData);
        setOutingRequests(outingData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Use mock data for demo
        setStudents([
          { id: '1', name: 'John Doe', rollNumber: 'CS2024001', branch: 'Computer Science', email: 'john@campus.edu', semester: 4 },
          { id: '2', name: 'Jane Smith', rollNumber: 'CS2024002', branch: 'Computer Science', email: 'jane@campus.edu', semester: 4 },
          { id: '3', name: 'Bob Wilson', rollNumber: 'EC2024001', branch: 'Electronics', email: 'bob@campus.edu', semester: 2 },
          { id: '4', name: 'Alice Brown', rollNumber: 'ME2024001', branch: 'Mechanical', email: 'alice@campus.edu', semester: 6 },
        ]);
        setOutingRequests([
          { id: '1', studentId: '1', studentName: 'John Doe', reason: 'Family function', fromDate: '2024-01-20', toDate: '2024-01-22', status: 'pending', createdAt: '2024-01-15' },
          { id: '2', studentId: '2', studentName: 'Jane Smith', reason: 'Medical checkup', fromDate: '2024-01-18', toDate: '2024-01-18', status: 'approved', createdAt: '2024-01-14' },
          { id: '3', studentId: '3', studentName: 'Bob Wilson', reason: 'Personal work', fromDate: '2024-01-25', toDate: '2024-01-26', status: 'pending', createdAt: '2024-01-17' },
        ]);
        setAnnouncements([
          { id: '1', title: 'Mid-Semester Exams Schedule', content: 'The mid-semester examinations will begin from February 15th.', createdAt: '2024-01-10', author: 'Admin' },
          { id: '2', title: 'Campus Maintenance', content: 'The library will be closed on Sunday for maintenance.', createdAt: '2024-01-12', author: 'Admin' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle marking attendance
  const handleMarkAttendance = async (
    studentId: string,
    date: string,
    subject: string,
    status: 'present' | 'absent'
  ) => {
    try {
      await markAttendance(studentId, date, subject, status);
      toast({
        title: 'Attendance Marked',
        description: `Marked ${status} for student on ${date}`,
      });
    } catch (error) {
      // Demo mode
      toast({
        title: 'Attendance Marked (Demo)',
        description: `Marked ${status} for student on ${date}`,
      });
    }
  };

  // Handle updating outing status
  const handleUpdateOutingStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateOutingStatus(id, status);
      setOutingRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
      toast({
        title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The outing request has been ${status}.`,
      });
    } catch (error) {
      // Demo mode - update locally
      setOutingRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
      toast({
        title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)} (Demo)`,
        description: `The outing request has been ${status}.`,
      });
    }
  };

  // Handle creating announcement
  const handleCreateAnnouncement = async (title: string, content: string) => {
    try {
      const newAnnouncement = await createAnnouncement(title, content);
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      toast({
        title: 'Announcement Published',
        description: 'Your announcement has been published.',
      });
    } catch (error) {
      // Demo mode - add locally
      const demoAnnouncement: Announcement = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Admin',
      };
      setAnnouncements((prev) => [demoAnnouncement, ...prev]);
      toast({
        title: 'Announcement Published (Demo)',
        description: 'Your announcement has been published.',
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage students, attendance, and announcements</p>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
            <TabsTrigger value="outing">Outing Requests</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentsList students={students} />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceMarker students={students} onMarkAttendance={handleMarkAttendance} />
          </TabsContent>

          <TabsContent value="outing">
            <OutingRequestsAdmin
              requests={outingRequests}
              onUpdateStatus={handleUpdateOutingStatus}
            />
          </TabsContent>

          <TabsContent value="announcements">
            <div className="grid gap-6 lg:grid-cols-2">
              <AnnouncementForm onCreateAnnouncement={handleCreateAnnouncement} />
              <AnnouncementsList announcements={announcements} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
