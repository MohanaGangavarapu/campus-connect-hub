// Student Dashboard Page
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileCard from '@/components/student/ProfileCard';
import AttendanceTable from '@/components/student/AttendanceTable';
import OutingRequests from '@/components/student/OutingRequests';
import AnnouncementsList from '@/components/student/AnnouncementsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile, AttendanceRecord, OutingRequest, Announcement } from '@/types';
import {
  getProfile,
  getAttendance,
  getOutingRequests,
  createOutingRequest,
  getAnnouncements,
} from '@/services/api';

const StudentDashboard: React.FC = () => {
  const { toast } = useToast();

  // State for all data
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [outingRequests, setOutingRequests] = useState<OutingRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [profileData, attendanceData, outingData, announcementsData] = await Promise.all([
          getProfile(),
          getAttendance(),
          getOutingRequests(),
          getAnnouncements(),
        ]);

        setProfile(profileData);
        setAttendance(attendanceData);
        setOutingRequests(outingData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Use mock data for demo
        setProfile({
          id: '1',
          name: 'John Doe',
          rollNumber: 'CS2024001',
          branch: 'Computer Science',
          email: 'john.doe@campus.edu',
          semester: 4,
        });
        setAttendance([
          { id: '1', date: '2024-01-15', subject: 'Data Structures', status: 'present' },
          { id: '2', date: '2024-01-15', subject: 'Database Systems', status: 'present' },
          { id: '3', date: '2024-01-16', subject: 'Data Structures', status: 'absent' },
          { id: '4', date: '2024-01-16', subject: 'Operating Systems', status: 'present' },
          { id: '5', date: '2024-01-17', subject: 'Computer Networks', status: 'present' },
        ]);
        setOutingRequests([
          {
            id: '1',
            studentId: '1',
            studentName: 'John Doe',
            reason: 'Family function',
            fromDate: '2024-01-20',
            toDate: '2024-01-22',
            status: 'approved',
            createdAt: '2024-01-15',
          },
          {
            id: '2',
            studentId: '1',
            studentName: 'John Doe',
            reason: 'Medical appointment',
            fromDate: '2024-01-25',
            toDate: '2024-01-25',
            status: 'pending',
            createdAt: '2024-01-18',
          },
        ]);
        setAnnouncements([
          {
            id: '1',
            title: 'Mid-Semester Exams Schedule',
            content: 'The mid-semester examinations will begin from February 15th. Please check the detailed schedule on the notice board.',
            createdAt: '2024-01-10',
            author: 'Academic Office',
          },
          {
            id: '2',
            title: 'Campus Maintenance',
            content: 'The library will be closed on Sunday for annual maintenance work.',
            createdAt: '2024-01-12',
            author: 'Admin Office',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle creating new outing request
  const handleCreateOutingRequest = async (reason: string, fromDate: string, toDate: string) => {
    try {
      const newRequest = await createOutingRequest(reason, fromDate, toDate);
      setOutingRequests((prev) => [newRequest, ...prev]);
      toast({
        title: 'Request Submitted',
        description: 'Your outing request has been submitted for approval.',
      });
    } catch (error) {
      // Demo mode - add locally
      const demoRequest: OutingRequest = {
        id: Date.now().toString(),
        studentId: '1',
        studentName: 'John Doe',
        reason,
        fromDate,
        toDate,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setOutingRequests((prev) => [demoRequest, ...prev]);
      toast({
        title: 'Request Submitted (Demo)',
        description: 'Your outing request has been submitted.',
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
          <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name}</p>
        </div>

        {/* Profile Card */}
        {profile && <ProfileCard profile={profile} />}

        {/* Tabbed Content */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="outing">Outing Requests</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceTable attendance={attendance} />
          </TabsContent>

          <TabsContent value="outing">
            <OutingRequests
              requests={outingRequests}
              onCreateRequest={handleCreateOutingRequest}
            />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsList announcements={announcements} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
