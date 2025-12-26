// Student Profile Card component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Hash, BookOpen, Mail, Calendar } from 'lucide-react';
import type { StudentProfile } from '@/types';

interface ProfileCardProps {
  profile: StudentProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-medium text-foreground">{profile.name}</p>
            </div>
          </div>

          {/* Roll Number */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Roll Number</p>
              <p className="font-medium text-foreground">{profile.rollNumber}</p>
            </div>
          </div>

          {/* Branch */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Branch</p>
              <p className="font-medium text-foreground">{profile.branch}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{profile.email}</p>
            </div>
          </div>

          {/* Semester */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Semester</p>
              <p className="font-medium text-foreground">{profile.semester}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
