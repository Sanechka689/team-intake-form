'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PublicLinks = {
  cheatsheet: string;
  table: string;
  instruction: string;
  askQuestion: string;
};

type PublicHomeProps = {
  links: PublicLinks;
  defaultFormPath: string | null;
};

export function PublicHome({ links, defaultFormPath }: PublicHomeProps) {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState('');

  const onOpenSecretLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clean = tokenInput.trim().replace(/^\/s\//, '');
    if (!clean) {
      return;
    }
    router.push(`/s/${encodeURIComponent(clean)}`);
  };

  return (
    <main className="relative overflow-hidden">
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />

      <section className="mx-auto flex min-h-[88vh] w-full max-w-5xl items-center px-4 py-12">
        <div className="section-card w-full animate-floatIn">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Командная анкета</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Быстрый и понятный сбор данных команды
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
            Один экран, подсказки в каждом поле, автоматическая запись в таблицу и возможность обновить ответ в любой момент.
          </p>

          <form className="mt-7 flex flex-col gap-3 md:flex-row" onSubmit={onOpenSecretLink}>
            <input
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder="Вставьте ваш ключ или путь /s/..."
              className="field-input h-11 md:flex-1"
            />
            <button
              type="submit"
              className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Открыть анкету
            </button>
            {defaultFormPath ? (
              <Link
                href={defaultFormPath}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Перейти по прямой ссылке
              </Link>
            ) : null}
          </form>

          <p className="mt-2 text-xs text-slate-500">
            Если ссылка не открывается — скопируйте только ключ после <code>/s/</code> и вставьте в поле.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-28 md:grid-cols-3">
        <article className="section-card">
          <h2 className="text-lg font-semibold">Что это</h2>
          <p className="mt-2 text-sm text-slate-600">
            Форма для команды, чтобы роли, интересы и загрузка сразу попадали в общую таблицу в нужные колонки.
          </p>
        </article>
        <article className="section-card">
          <h2 className="text-lg font-semibold">Как заполнить</h2>
          <p className="mt-2 text-sm text-slate-600">
            Заполняйте простыми фразами. Контакт обязателен — по нему система обновляет вашу запись без дублей.
          </p>
        </article>
        <article className="section-card">
          <h2 className="text-lg font-semibold">Полезные ссылки</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.cheatsheet} target="_blank" rel="noreferrer">
              Шпаргалка
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.table} target="_blank" rel="noreferrer">
              Таблица
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.instruction} target="_blank" rel="noreferrer">
              Инструкция
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.askQuestion} target="_blank" rel="noreferrer">
              Задать вопрос
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
