import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
      <div className="section-card w-full text-center">
        <h1 className="text-2xl font-semibold">Ссылка на анкету</h1>
        <p className="mt-3 text-slate-600">Откройте приватную ссылку формата /s/ВАШ_КЛЮЧ.</p>
        <p className="mt-6">
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-700" href="/s/demo">
            Пример маршрута
          </Link>
        </p>
      </div>
    </main>
  );
}
