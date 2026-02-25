'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { FilterBar, type FilterConfig } from '@/components/ui/filter-bar';
import { studentsApi, type Student, type SearchStudentsQuery } from '@/lib/api/students';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';

const caseStatusLabel: Record<string, string> = {
  active: 'Active',
  resolved: 'Resolved',
  needsAD: 'Needs AD',
  support: 'Support',
};

const caseStatusClass: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  resolved: 'bg-blue-100 text-blue-800',
  needsAD: 'bg-red-100 text-red-800',
  support: 'bg-amber-100 text-amber-800',
};

export function MyStudentsContent() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<SearchStudentsQuery>({});

  const {
    data: students = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['students', 'my-students', filters],
    queryFn: () => studentsApi.getAll(filters),
  });

  const columns: ColumnDef<Student>[] = [
    {
      id: 'name',
      header: 'Student',
      cell: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      id: 'gradeLevel',
      header: 'Grade',
      cell: (row) => row.gradeLevel || '—',
    },
    {
      id: 'status',
      header: 'Enrollment',
      cell: (row) => row.status || '—',
    },
    {
      id: 'caseStatus',
      header: 'Case Status',
      cell: (row) => {
        const status = row.caseStatus || 'active';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              caseStatusClass[status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {caseStatusLabel[status] || status}
          </span>
        );
      },
    },
  ];

  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Enrollment',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'graduated', label: 'Graduated' },
        { value: 'transferred', label: 'Transferred' },
      ],
    },
    {
      key: 'caseStatus',
      label: 'Case Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'needsAD', label: 'Needs AD' },
        { value: 'support', label: 'Support' },
      ],
    },
  ];

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>My Students</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            View assigned students, their case status, and recent session context.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        <FilterBar
          filters={filterConfigs}
          onFilterChange={(nextFilters) => setFilters(nextFilters as SearchStudentsQuery)}
          onClear={() => setFilters({})}
        />

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Failed to load students</p>
            <p className="mt-1 text-sm">{getErrorMessage(error)}</p>
          </div>
        )}

        <DataTable
          data={students}
          columns={columns}
          onView={(student) => router.push(`/my-students/${student.id}`)}
          isLoading={isLoading}
          emptyMessage="No students found"
        />
      </div>
    </div>
  );
}
