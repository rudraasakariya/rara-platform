import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { ProfileContent } from './profile-content';

export default async function ProfilePage() {
  // Get user from server-side cookie
  const user = await getServerUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?invalid_token=true');
  }

  // Pass user to client component
  return <ProfileContent initialUser={user} />;
}
