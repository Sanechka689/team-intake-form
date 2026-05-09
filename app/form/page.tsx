import { IntakeForm } from '@/components/intake-form';
import { getAccessSecret } from '@/lib/security/access';

export default function FormPage() {
  const token = getAccessSecret();

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <div className="section-card w-full text-center">
          <h1 className="text-2xl font-semibold">Анкета временно недоступна</h1>
          <p className="mt-3 text-slate-600">
            В Vercel не задан `APP_SECRET`. Добавьте его в Project Settings → Environment Variables, затем сделайте Redeploy.
          </p>
        </div>
      </main>
    );
  }

  return <IntakeForm token={token} />;
}
