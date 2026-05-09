import Link from 'next/link';
import { getProjectLinks } from '@/lib/links';

export default function ThanksPage({ searchParams }: { searchParams: { operation?: string; row?: string } }) {
  const links = getProjectLinks();
  const operation = searchParams.operation === 'update' ? 'update' : 'insert';
  const row = searchParams.row ? Number(searchParams.row) : null;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10">
      <section className="section-card w-full bg-gradient-to-br from-white via-emerald-50 to-cyan-50 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">Готово</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Спасибо! Форма отправлена</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          {operation === 'insert'
            ? 'Мы получили вашу анкету и добавили её в таблицу команды.'
            : 'Мы получили вашу анкету и обновили вашу запись в таблице команды.'}
        </p>
        {row ? <p className="mt-2 text-sm text-slate-500">Номер строки в таблице: {row}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href={links.askQuestion} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Поделиться в Telegram
          </a>
          <a href={links.table} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Перейти в таблицу
          </a>
          <Link href="/form" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Заполнить ещё раз
          </Link>
        </div>
      </section>
    </main>
  );
}
