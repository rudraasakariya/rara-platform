import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { MySessionsContent } from './my-sessions-content';

export default async function MySessionsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  return <MySessionsContent />;
}
