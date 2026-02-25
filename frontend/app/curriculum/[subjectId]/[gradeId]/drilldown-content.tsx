'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { curriculumApi } from '@/lib/api/curriculum';
import { getErrorMessage } from '@/lib/api-client';
import { TaxonomySelector, type TaxonomySelectorValue } from '@/components/curriculum/taxonomy-selector';

interface DrilldownContentProps {
  subjectId: string;
  gradeId: string;
}

export function DrilldownContent({ subjectId, gradeId }: DrilldownContentProps) {
  const [selectedTaxonomy, setSelectedTaxonomy] = React.useState<TaxonomySelectorValue | null>(null);
  const handleTaxonomyChange = React.useCallback((value: TaxonomySelectorValue) => {
    setSelectedTaxonomy((previousValue) => {
      if (
        previousValue &&
        previousValue.subjectId === value.subjectId &&
        previousValue.gradeId === value.gradeId &&
        previousValue.domainId === value.domainId &&
        previousValue.clusterId === value.clusterId &&
        previousValue.skillId === value.skillId
      ) {
        return previousValue;
      }

      return value;
    });
  }, []);

  const {
    data: tree,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['curriculum', 'tree', subjectId, gradeId],
    queryFn: () => curriculumApi.getTreeBySubjectAndGrade(subjectId, gradeId),
  });

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select standard</CardTitle>
        </CardHeader>
        <CardContent>
          <TaxonomySelector
            value={{ subjectId, gradeId }}
            onChange={handleTaxonomyChange}
          />
          {selectedTaxonomy && (
            <p className="mt-3 text-sm text-muted-foreground">
              Selected cluster: {selectedTaxonomy.clusterId || 'none'} · Selected skill:{' '}
              {selectedTaxonomy.skillId || 'none'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain → Cluster → Skill</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading taxonomy tree...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
          ) : !tree ? (
            <p className="text-sm text-muted-foreground">No taxonomy data found.</p>
          ) : (
            <div className="space-y-6">
              {tree.domains.map((domain) => (
                <div key={domain.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {domain.code} - {domain.label}
                      </p>
                      {domain.description && (
                        <p className="mt-1 text-xs text-slate-600">{domain.description}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                      Domain
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    {domain.clusters.map((cluster) => (
                      <div key={cluster.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                        <p className="text-sm font-medium text-slate-900">
                          {cluster.code} - {cluster.label}
                        </p>
                        {cluster.description && (
                          <p className="mt-1 text-xs text-slate-600">{cluster.description}</p>
                        )}

                        <ul className="mt-2 space-y-2">
                          {cluster.skills.map((skill) => (
                            <li key={skill.id} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800">
                              <span className="font-semibold">{skill.code}</span> - {skill.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
