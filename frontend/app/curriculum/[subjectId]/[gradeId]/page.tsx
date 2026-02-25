import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { pageStyles } from '@/styles';
import { DrilldownContent } from './drilldown-content';

interface CurriculumDrilldownPageProps {
  params: Promise<{
    subjectId: string;
    gradeId: string;
  }>;
}

export default async function CurriculumDrilldownPage({ params }: CurriculumDrilldownPageProps) {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  const { subjectId, gradeId } = await params;

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Curriculum Drill-Down</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Subject {subjectId} · Grade {gradeId}
          </p>
        </div>
      </div>

      <DrilldownContent subjectId={subjectId} gradeId={gradeId} />
      <DrilldownContent subjectId={subjectId} gradeId={gradeId} />
    </div>
  );
}
