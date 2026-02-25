import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pageStyles } from '@/styles';

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

      <div className="w-full max-w-5xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading taxonomy map</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Detailed domain, cluster, and skill navigation is implemented in the taxonomy selector issue.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
