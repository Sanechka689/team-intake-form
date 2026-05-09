import { notFound } from 'next/navigation';
import { IntakeForm } from '@/components/intake-form';

export default function SecretFormPage({ params }: { params: { token: string } }) {
  const secret = process.env.APP_SECRET;
  if (!secret || params.token !== secret) {
    notFound();
  }

  return <IntakeForm token={params.token} />;
}
