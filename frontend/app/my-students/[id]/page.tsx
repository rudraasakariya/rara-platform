import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { StudentDetailContent } from './student-detail-content';

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  const { id } = await params;

  return <StudentDetailContent studentId={id} />;
}
