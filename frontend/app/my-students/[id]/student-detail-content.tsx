'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studentsApi } from '@/lib/api/students';
import { sessionsApi } from '@/lib/api/sessions';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';

interface StudentDetailContentProps {
  studentId: string;
}

export function StudentDetailContent({ studentId }: StudentDetailContentProps) {
  const {
    data: student,
    isLoading: isLoadingStudent,
    error: studentError,
  } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => studentsApi.getById(studentId),
  });

  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useQuery({
    queryKey: ['sessions', 'student', studentId],
    queryFn: () => sessionsApi.getAll({ studentId }),
  });

  if (isLoadingStudent) {
    return <p className="text-sm text-muted-foreground">Loading student details...</p>;
  }

  if (studentError || !student) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">Failed to load student</p>
        <p className="mt-1 text-sm">{getErrorMessage(studentError)}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>
            {student.firstName} {student.lastName}
          </h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Grade {student.gradeLevel || '—'} · Case status: {student.caseStatus || 'active'}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/my-students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Students
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span> {student.firstName} {student.lastName}
            </p>
            <p>
              <span className="font-medium">Grade:</span> {student.gradeLevel || '—'}
            </p>
            <p>
              <span className="font-medium">Enrollment:</span> {student.status || 'active'}
            </p>
            <p>
              <span className="font-medium">Case Status:</span> {student.caseStatus || 'active'}
            </p>
            <p>
              <span className="font-medium">Notes:</span> {student.notes || '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Items (Read-only)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Action item integration is read-only in this phase. Detailed action item APIs can be wired in a follow-up issue.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <p className="text-sm text-muted-foreground">Loading sessions...</p>
            ) : sessionsError ? (
              <p className="text-sm text-destructive">{getErrorMessage(sessionsError)}</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions found for this student.</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="rounded-md border border-slate-200 p-3">
                    <p className="text-sm font-medium">
                      {new Date(session.sessionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {session.skillCode || session.clusterCode || '—'} -{' '}
                      {session.skillLabel || session.clusterLabel || 'No taxonomy label'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Status: {session.status}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
