import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { AvailabilityContent } from './availability-content';

export default async function AvailabilityPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login?invalid_token=true');
  }

  return <AvailabilityContent />;
}
