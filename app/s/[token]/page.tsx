import Link from 'next/link';
import { IntakeForm } from '@/components/intake-form';
import { getAccessSecret } from '@/lib/security/access';

export default function SecretFormPage({ params }: { params: { token: string } }) {
  const secret = getAccessSecret();

  if (!secret) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <div className="section-card w-full text-center">
          <h1 className="text-2xl font-semibold">Анкета временно недоступна</h1>
          <p className="mt-3 text-slate-600">
            Сервисный ключ не задан в окружении Vercel (`APP_SECRET`), поэтому ссылка не может быть проверена.
          </p>
        </div>
      </main>
    );
  }

  if (params.token !== secret) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <div className="section-card w-full text-center">
          <h1 className="text-2xl font-semibold">Ссылка недействительна</h1>
          <p className="mt-3 text-slate-600">Проверьте ключ или откройте стартовую страницу, чтобы вставить его вручную.</p>
          <p className="mt-6">
            <Link className="text-sm font-medium text-blue-600 hover:text-blue-700" href="/">
              Перейти на стартовую страницу
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return <IntakeForm token={params.token} />;
}
