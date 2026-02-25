import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { ReportsContent } from './reports-content';

export default async function ReportsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  return <ReportsContent />;
}
