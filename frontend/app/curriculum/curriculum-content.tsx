'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { pageStyles } from '@/styles';
import { curriculumApi, type CurriculumSubject } from '@/lib/api/curriculum';
import { getErrorMessage } from '@/lib/api-client';

export function CurriculumContent() {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>('');

  const {
    data: subjects = [],
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useQuery({
    queryKey: ['curriculum', 'subjects'],
    queryFn: curriculumApi.getSubjects,
  });

  React.useEffect(() => {
    if (!selectedSubjectId && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? null;

  const {
    data: grades = [],
    isLoading: isLoadingGrades,
    error: gradesError,
  } = useQuery({
    queryKey: ['curriculum', 'subjects', selectedSubjectId, 'grades'],
    queryFn: () => curriculumApi.getGradesBySubjectId(selectedSubjectId),
    enabled: !!selectedSubjectId,
  });

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Curriculum Map</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Select a subject and grade to explore domains, clusters, and skills.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject</CardTitle>
            <CardDescription>
              Choose a subject to load available grades for the coherence map.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubjects ? (
              <Skeleton className="h-10 w-72" />
            ) : subjectsError ? (
              <p className="text-sm text-destructive">{getErrorMessage(subjectsError)}</p>
            ) : (
              <select
                value={selectedSubjectId}
                onChange={(event) => setSelectedSubjectId(event.target.value)}
                className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedSubject ? `${selectedSubject.name} Grade Map` : 'Grade Map'}
            </CardTitle>
            <CardDescription>
              Pick a grade tile to open curriculum drill-down for that subject.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingGrades ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 w-full" />
                ))}
              </div>
            ) : gradesError ? (
              <p className="text-sm text-destructive">{getErrorMessage(gradesError)}</p>
            ) : grades.length === 0 ? (
              <p className="text-sm text-muted-foreground">No grades found for this subject.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {grades.map((grade) => (
                  <Link
                    key={grade.id}
                    href={`/curriculum/${selectedSubjectId}/${grade.id}`}
                    className="group relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 transition hover:border-slate-400 hover:shadow-md"
                  >
                    <div className="flex h-full flex-col justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Grade
                        </p>
                        <p className="mt-1 text-3xl font-bold text-slate-900">{grade.code}</p>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{grade.label}</p>
                      </div>

                      <div className="flex items-center text-xs font-medium text-slate-700">
                        <BookOpenText className="mr-1 h-4 w-4" />
                        Open map
                        <ArrowRight className="ml-1 h-3 w-3 transition group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
