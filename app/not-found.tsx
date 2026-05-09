import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
      <div className="section-card w-full text-center">
        <h1 className="text-2xl font-semibold">Страница не найдена</h1>
        <p className="mt-3 text-slate-600">Возможно, ссылка устарела. Вернитесь на главную и откройте анкету заново.</p>
        <p className="mt-5">
          <Link href="/" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            На главную
          </Link>
        </p>
      </div>
    </main>
  );
}
