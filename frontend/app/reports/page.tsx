import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pageStyles } from '@/styles';

export default async function ReportsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  if (user.role === 'tutor') {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Reports</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Analytics and reporting views for curriculum progress and session coverage.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This route is now wired into admin navigation. Report widgets can be added in follow-up issues.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
