'use client';

import Link from 'next/link';

type PublicLinks = {
  folder: string;
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
  return (
    <main className="relative overflow-hidden">
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />

      <section className="mx-auto flex min-h-[88vh] w-full max-w-5xl items-center px-4 py-12">
        <div className="section-card w-full animate-floatIn">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Проект команды</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Заполняем анкету, чтобы собрать сильную рабочую команду
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
            Мы запускаем совместный проект и собираем роли, опыт, интересы и ограничения участников. Это нужно, чтобы правильно
            распределить задачи, никого не перегрузить и быстро стартовать работу.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">Что делаем</p>
              <p className="mt-1 text-xs text-slate-600">Собираем данные по ролям, навыкам и доступности команды.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">Для чего</p>
              <p className="mt-1 text-xs text-slate-600">Чтобы задачи попадали правильным людям и работа шла без хаоса.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">Сколько времени</p>
              <p className="mt-1 text-xs text-slate-600">Обычно 5–10 минут, при этом ответы можно обновить позже.</p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 md:flex-row">
            {defaultFormPath ? (
              <Link
                href={defaultFormPath}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Начни отсюда
              </Link>
            ) : (
              <span className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-200 px-5 text-sm font-medium text-slate-500">
                Анкета скоро откроется
              </span>
            )}
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              href={links.instruction}
              target="_blank"
              rel="noreferrer"
            >
              Пошаговая инструкция
            </a>
          </div>

          <p className="mt-2 text-xs text-slate-500">Никаких ключей вводить не нужно — просто нажмите кнопку и заполните форму.</p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-28 md:grid-cols-3">
        <article className="section-card">
          <h2 className="text-lg font-semibold">Как пройти форму</h2>
          <p className="mt-2 text-sm text-slate-600">
            Нажмите «Начни отсюда», заполните все обязательные поля и отправьте. После отправки вы увидите статус сохранения.
          </p>
        </article>
        <article className="section-card">
          <h2 className="text-lg font-semibold">Что будет с данными</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ответы автоматически записываются в таблицу проекта в нужные колонки. Повторная отправка обновляет вашу строку.
          </p>
        </article>
        <article className="section-card">
          <h2 className="text-lg font-semibold">Полезные ссылки</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.folder} target="_blank" rel="noreferrer">
              Папка проекта
            </a>
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
