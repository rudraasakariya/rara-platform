import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { MyStudentsContent } from './my-students-content';

export default async function MyStudentsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  return <MyStudentsContent />;
}
