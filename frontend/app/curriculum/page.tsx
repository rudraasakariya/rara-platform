import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { CurriculumContent } from './curriculum-content';

export default async function CurriculumPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  return <CurriculumContent />;
}
