// Attendance Table component for students (read-only)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import type { AttendanceRecord } from '@/types';

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ attendance }) => {
  // Calculate attendance percentage
  const totalClasses = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Attendance Record
          </CardTitle>
          <div className="text-sm">
            <span className="text-muted-foreground">Attendance: </span>
            <span className={`font-bold ${percentage >= 75 ? 'text-success' : 'text-destructive'}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {attendance.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No attendance records found.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell className="text-center">
                      {record.status === 'present' ? (
                        <span className="inline-flex items-center gap-1 text-success">
                          <CheckCircle className="h-4 w-4" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <XCircle className="h-4 w-4" />
                          Absent
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
