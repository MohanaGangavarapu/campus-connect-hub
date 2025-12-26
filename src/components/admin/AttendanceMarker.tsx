// Attendance Marker component for Admin
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardCheck, UserCheck, UserX } from 'lucide-react';
import type { StudentProfile } from '@/types';

interface AttendanceMarkerProps {
  students: StudentProfile[];
  onMarkAttendance: (
    studentId: string,
    date: string,
    subject: string,
    status: 'present' | 'absent'
  ) => Promise<void>;
}

const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({ students, onMarkAttendance }) => {
  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle marking attendance
  const handleMark = async (status: 'present' | 'absent') => {
    if (!selectedStudent || !date || !subject) {
      alert('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onMarkAttendance(selectedStudent, date, subject, status);
      // Reset form
      setSelectedStudent('');
      setDate('');
      setSubject('');
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Mark Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Select Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.rollNumber} - {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject name"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleMark('present')}
              disabled={isSubmitting}
              className="flex-1 bg-success hover:bg-success/90"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Mark Present
            </Button>
            <Button
              onClick={() => handleMark('absent')}
              disabled={isSubmitting}
              variant="destructive"
              className="flex-1"
            >
              <UserX className="h-4 w-4 mr-2" />
              Mark Absent
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceMarker;
