import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { PartnersContent } from './partners-content';

export default async function PartnersPage() {
  // Get user from server-side cookie
  const user = await getServerUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?invalid_token=true');
  }

  // Pass user to client component
  return <PartnersContent />;
}
