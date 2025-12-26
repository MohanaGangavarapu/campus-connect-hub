// Outing Requests Admin component for approving/rejecting requests
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, X, Clock, User } from 'lucide-react';
import type { OutingRequest } from '@/types';

interface OutingRequestsAdminProps {
  requests: OutingRequest[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

const OutingRequestsAdmin: React.FC<OutingRequestsAdminProps> = ({
  requests,
  onUpdateStatus,
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      await onUpdateStatus(id, status);
    } catch (error) {
      console.error('Failed to update outing status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter to show pending requests first
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Outing Requests
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-warning/10 text-warning">
            {requests.filter((r) => r.status === 'pending').length} pending
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No outing requests.</p>
        ) : (
          <div className="space-y-3">
            {sortedRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-lg border space-y-3 ${
                  request.status === 'pending' ? 'bg-warning/5 border-warning/20' : 'bg-secondary/30'
                }`}
              >
                {/* Header with student info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{request.studentName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>
                  {request.status !== 'pending' && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        request.status === 'approved'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {request.fromDate} - {request.toDate}
                  </span>
                </div>

                {/* Action buttons for pending requests */}
                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      disabled={processingId === request.id}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      disabled={processingId === request.id}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutingRequestsAdmin;
