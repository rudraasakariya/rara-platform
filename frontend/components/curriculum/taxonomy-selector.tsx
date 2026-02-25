'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  curriculumApi,
  type CurriculumClusterNode,
  type CurriculumDomainNode,
  type CurriculumGrade,
} from '@/lib/api/curriculum';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage } from '@/lib/api-client';

export interface TaxonomySelectorValue {
  subjectId: string;
  gradeId: string;
  domainId: string;
  clusterId: string | null;
  skillId: string | null;
}

interface TaxonomySelectorProps {
  value?: Partial<TaxonomySelectorValue>;
  onChange?: (value: TaxonomySelectorValue) => void;
  disabled?: boolean;
}

function buildNextValue(
  current: TaxonomySelectorValue,
  update: Partial<TaxonomySelectorValue>,
): TaxonomySelectorValue {
  return {
    ...current,
    ...update,
  };
}

export function TaxonomySelector({ value, onChange, disabled = false }: TaxonomySelectorProps) {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>(value?.subjectId ?? '');
  const [selectedGradeId, setSelectedGradeId] = React.useState<string>(value?.gradeId ?? '');
  const [selectedDomainId, setSelectedDomainId] = React.useState<string>(value?.domainId ?? '');
  const [selectedClusterId, setSelectedClusterId] = React.useState<string>(value?.clusterId ?? '');
  const [selectedSkillId, setSelectedSkillId] = React.useState<string>(value?.skillId ?? '');

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

  const {
    data: grades = [],
    isLoading: isLoadingGrades,
    error: gradesError,
  } = useQuery({
    queryKey: ['curriculum', 'subjects', selectedSubjectId, 'grades'],
    queryFn: () => curriculumApi.getGradesBySubjectId(selectedSubjectId),
    enabled: !!selectedSubjectId,
  });

  React.useEffect(() => {
    if (!selectedGradeId && grades.length > 0) {
      setSelectedGradeId(grades[0].id);
    }
  }, [grades, selectedGradeId]);

  const {
    data: tree,
    isLoading: isLoadingTree,
    error: treeError,
  } = useQuery({
    queryKey: ['curriculum', 'tree', selectedSubjectId, selectedGradeId],
    queryFn: () => curriculumApi.getTreeBySubjectAndGrade(selectedSubjectId, selectedGradeId),
    enabled: !!selectedSubjectId && !!selectedGradeId,
  });

  const domains = tree?.domains ?? [];
  const selectedDomain: CurriculumDomainNode | null =
    domains.find((domain) => domain.id === selectedDomainId) ?? null;
  const clusters = selectedDomain?.clusters ?? [];

  const selectedCluster: CurriculumClusterNode | null =
    clusters.find((cluster) => cluster.id === selectedClusterId) ?? null;

  const skills = selectedCluster?.skills ?? [];

  React.useEffect(() => {
    if (!selectedDomainId && domains.length > 0) {
      setSelectedDomainId(domains[0].id);
    }
  }, [domains, selectedDomainId]);

  React.useEffect(() => {
    if (!selectedClusterId && clusters.length > 0) {
      setSelectedClusterId(clusters[0].id);
      setSelectedSkillId('');
    }
  }, [clusters, selectedClusterId]);

  React.useEffect(() => {
    if (!onChange) {
      return;
    }

    const currentValue: TaxonomySelectorValue = {
      subjectId: selectedSubjectId,
      gradeId: selectedGradeId,
      domainId: selectedDomainId,
      clusterId: selectedClusterId || null,
      skillId: selectedSkillId || null,
    };

    onChange(buildNextValue(currentValue, {}));
  }, [onChange, selectedSubjectId, selectedGradeId, selectedDomainId, selectedClusterId, selectedSkillId]);

  const handleSubjectChange = (nextSubjectId: string) => {
    setSelectedSubjectId(nextSubjectId);
    setSelectedGradeId('');
    setSelectedDomainId('');
    setSelectedClusterId('');
    setSelectedSkillId('');
  };

  const handleGradeChange = (nextGradeId: string) => {
    setSelectedGradeId(nextGradeId);
    setSelectedDomainId('');
    setSelectedClusterId('');
    setSelectedSkillId('');
  };

  const handleDomainChange = (nextDomainId: string) => {
    setSelectedDomainId(nextDomainId);
    setSelectedClusterId('');
    setSelectedSkillId('');
  };

  const handleClusterChange = (nextClusterId: string) => {
    setSelectedClusterId(nextClusterId);
    setSelectedSkillId('');
  };

  const renderError = subjectsError || gradesError || treeError;

  if (isLoadingSubjects) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="taxonomy-subject">Subject</Label>
          <select
            id="taxonomy-subject"
            value={selectedSubjectId}
            onChange={(event) => handleSubjectChange(event.target.value)}
            disabled={disabled}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxonomy-grade">Grade</Label>
          {isLoadingGrades ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              id="taxonomy-grade"
              value={selectedGradeId}
              onChange={(event) => handleGradeChange(event.target.value)}
              disabled={disabled || !selectedSubjectId}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {grades.map((grade: CurriculumGrade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.code} - {grade.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="taxonomy-domain">Domain</Label>
          {isLoadingTree ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              id="taxonomy-domain"
              value={selectedDomainId}
              onChange={(event) => handleDomainChange(event.target.value)}
              disabled={disabled || domains.length === 0}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.code} - {domain.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxonomy-cluster">Cluster</Label>
          <select
            id="taxonomy-cluster"
            value={selectedClusterId}
            onChange={(event) => handleClusterChange(event.target.value)}
            disabled={disabled || clusters.length === 0}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {clusters.map((cluster) => (
              <option key={cluster.id} value={cluster.id}>
                {cluster.code} - {cluster.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxonomy-skill">Skill (optional)</Label>
          <select
            id="taxonomy-skill"
            value={selectedSkillId}
            onChange={(event) => setSelectedSkillId(event.target.value)}
            disabled={disabled || skills.length === 0}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Use cluster only</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.code} - {skill.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {renderError && <p className="text-sm text-destructive">{getErrorMessage(renderError)}</p>}
    </div>
  );
}
