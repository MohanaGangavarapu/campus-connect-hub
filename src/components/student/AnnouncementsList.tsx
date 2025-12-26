// Announcements List component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Calendar, User } from 'lucide-react';
import type { Announcement } from '@/types';

interface AnnouncementsListProps {
  announcements: Announcement[];
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ announcements }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border bg-card shadow-sm space-y-2"
              >
                <h3 className="font-semibold text-foreground text-lg">
                  {announcement.title}
                </h3>
                <p className="text-muted-foreground">{announcement.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {announcement.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {announcement.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsList;
