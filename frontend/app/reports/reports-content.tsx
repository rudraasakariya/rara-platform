'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { reportsApi, type CoverageQuery, type TrendQuery } from '@/lib/api/reports';
import { sitesApi } from '@/lib/api/sites';
import { tutorsApi } from '@/lib/api/tutors';
import { curriculumApi } from '@/lib/api/curriculum';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';

export function ReportsContent() {
  // ── Filter state ───────────────────────────────────────────────────────────
  const [tutorId, setTutorId] = React.useState('');
  const [siteId, setSiteId] = React.useState('');
  const [subjectId, setSubjectId] = React.useState('');
  const [gradeId, setGradeId] = React.useState('');
  const [domainId, setDomainId] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [groupBy, setGroupBy] = React.useState<'week' | 'month'>('week');

  // Reset dependent filters when parent changes
  const handleSubjectChange = (v: string) => {
    setSubjectId(v);
    setGradeId('');
    setDomainId('');
  };
  const handleGradeChange = (v: string) => {
    setGradeId(v);
    setDomainId('');
  };

  // ── Dropdown data ──────────────────────────────────────────────────────────
  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: () => sitesApi.getAll(),
  });

  const { data: tutors = [] } = useQuery({
    queryKey: ['tutors'],
    queryFn: () => tutorsApi.getAll(),
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['curriculum-subjects'],
    queryFn: () => curriculumApi.getSubjects(),
  });

  const { data: grades = [] } = useQuery({
    queryKey: ['curriculum-grades', subjectId],
    queryFn: () => curriculumApi.getGradesBySubjectId(subjectId),
    enabled: !!subjectId,
  });

  const { data: domains = [] } = useQuery({
    queryKey: ['curriculum-domains', gradeId],
    queryFn: () => curriculumApi.getDomainsByGradeId(gradeId),
    enabled: !!gradeId,
  });

  // ── Build query params ─────────────────────────────────────────────────────
  const coverageQuery: CoverageQuery = {
    ...(tutorId && { tutorId }),
    ...(siteId && { siteId }),
    ...(subjectId && { subjectId }),
    ...(gradeId && { gradeId }),
    ...(domainId && { domainId }),
    ...(from && { from }),
    ...(to && { to }),
  };

  const trendQuery: TrendQuery = { ...coverageQuery, groupBy };

  // ── Report data ────────────────────────────────────────────────────────────
  const {
    data: coverage,
    isLoading: coverageLoading,
    error: coverageError,
  } = useQuery({
    queryKey: ['reports-coverage', coverageQuery],
    queryFn: () => reportsApi.getCoverage(coverageQuery),
  });

  const {
    data: trend,
    isLoading: trendLoading,
    error: trendError,
  } = useQuery({
    queryKey: ['reports-trend', trendQuery],
    queryFn: () => reportsApi.getTrend(trendQuery),
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  const coveragePercent = coverage?.coveragePercent ?? 0;
  const progressColor =
    coveragePercent >= 75
      ? 'bg-green-500'
      : coveragePercent >= 40
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <div>
      {/* Header */}
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Reports</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Skill coverage and session trends
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 space-y-6">

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Filters</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {/* Tutor */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Tutor</label>
              <select
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={tutorId}
                onChange={(e) => setTutorId(e.target.value)}
              >
                <option value="">All tutors</option>
                {tutors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Site */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Site</label>
              <select
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
              >
                <option value="">All sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Service area</label>
              <select
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">All subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Grade</label>
              <select
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={gradeId}
                onChange={(e) => handleGradeChange(e.target.value)}
                disabled={!subjectId}
              >
                <option value="">All grades</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Domain */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Domain</label>
              <select
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                disabled={!gradeId}
              >
                <option value="">All domains</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* From date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">From</label>
              <input
                type="date"
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            {/* To date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">To</label>
              <input
                type="date"
                className="border rounded-md px-2 py-1.5 text-sm bg-white"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Coverage widget ──────────────────────────────────────────────── */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Skill Coverage</h2>

          {coverageError && (
            <p className="text-sm text-destructive">{getErrorMessage(coverageError)}</p>
          )}

          {coverageLoading ? (
            <div className="h-20 animate-pulse bg-gray-100 rounded-md" />
          ) : (
            <div className="space-y-3">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {coveragePercent.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 mb-1">
                  ({coverage?.coveredSkills ?? 0} / {coverage?.totalSkills ?? 0} skills covered)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${Math.min(coveragePercent, 100)}%` }}
                />
              </div>

              {coverage?.totalSkills === 0 && (
                <p className="text-sm text-gray-400">
                  No skills found for the selected filters. Try selecting a service area or grade.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Trend chart ──────────────────────────────────────────────────── */}
        <div className="bg-white border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Trend Over Time</h2>
            <div className="flex gap-1 text-sm">
              {(['week', 'month'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupBy(g)}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    groupBy === g
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {trendError && (
            <p className="text-sm text-destructive">{getErrorMessage(trendError)}</p>
          )}

          {trendLoading ? (
            <div className="h-64 animate-pulse bg-gray-100 rounded-md" />
          ) : !trend?.data.length ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No session data for the selected filters.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trend.data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessionCount" name="Sessions" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="skillsCovered" name="Skills covered" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
