import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  // Get user from server-side cookie
  const user = await getServerUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Pass user to client component
  return <DashboardContent initialUser={user} />;
}
