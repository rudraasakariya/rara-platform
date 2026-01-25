import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  // Get user from server-side cookie
  const user = await getServerUser();
  
  // Redirect to login if not authenticated
  // Add query param to prevent middleware from redirecting back
  if (!user) {
    redirect('/login?invalid_token=true');
  }

  // Pass user to client component
  return <DashboardContent initialUser={user} />;
}
