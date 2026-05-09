import Link from 'next/link';
import { getProjectLinks } from '@/lib/links';

export function PublicHome() {
  const links = getProjectLinks();

  return (
    <main className="relative overflow-hidden pb-20">
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />

      <section className="mx-auto flex min-h-[76vh] w-full max-w-6xl items-center px-4 py-12">
        <div className="section-card w-full animate-floatIn bg-gradient-to-br from-white via-blue-50 to-cyan-50">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Проект команды</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">Собираем сильное маркетинговое агентство вместе</h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-700 md:text-base">
            Мы формируем рабочую команду под реальные маркетинговые задачи: контент, аналитика, дизайн, лидогенерация, упаковка и операционные
            процессы. Эта анкета нужна, чтобы быстро собрать роли и запустить работу без хаоса.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
            Для участников это простой маршрут: короткий бриф, понятная форма с подсказками, кнопки на все материалы и автоматическая запись
            ответов в таблицу.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700">Для новичков и опытных</span>
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700">5–10 минут на заполнение</span>
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700">Без лишних шагов</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/form" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Начни отсюда
            </Link>
            <Link href="/instruction" className="rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
              Пошаговая инструкция
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="section-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Где мы сейчас в проекте</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Этап: сбор и распределение команды</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Шаг 1</p>
              <p className="mt-1 text-sm font-semibold">Понять контекст</p>
              <p className="mt-2 text-xs text-slate-600">Посмотреть бриф и материалы проекта.</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Шаг 2 — сейчас</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">Заполнить анкету</p>
              <p className="mt-2 text-xs text-blue-700">Описать навыки, интересы, роль и доступность.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Шаг 3</p>
              <p className="mt-1 text-sm font-semibold">Распределение ролей</p>
              <p className="mt-2 text-xs text-slate-600">Координатор формирует задачи по ответам.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Шаг 4</p>
              <p className="mt-1 text-sm font-semibold">Старт работы</p>
              <p className="mt-2 text-xs text-slate-600">Команда получает задачи и начинает работу.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800">Что заполнять в анкете</summary>
              <p className="mt-2 text-sm text-slate-600">Контакт, статус участия, навыки, интересные задачи, ограничения и желаемую роль.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800">Как пользоваться материалами</summary>
              <p className="mt-2 text-sm text-slate-600">Откройте шпаргалку и инструкцию, если хотите примеры формулировок и шаблоны ответов.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800">Что будет после отправки</summary>
              <p className="mt-2 text-sm text-slate-600">Откроется страница «Спасибо», а данные попадут в таблицу и уйдут координатору.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 md:grid-cols-3">
        <article className="section-card">
          <h2 className="text-lg font-semibold">Зачем это нужно</h2>
          <p className="mt-2 text-sm text-slate-600">
            Чтобы каждый участник попал в правильную роль, а у координатора была единая и актуальная картина по людям, навыкам и загрузке.
          </p>
        </article>

        <article className="section-card">
          <h2 className="text-lg font-semibold">Какой результат</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ваши ответы автоматически попадают в нужные колонки таблицы. Если отправить форму повторно с тем же контактом — запись обновится, без
            дублей.
          </p>
        </article>

        <article className="section-card">
          <h2 className="text-lg font-semibold">Материалы проекта</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.folder}>
              Папка проекта
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.cheatsheet}>
              Шпаргалка
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.table}>
              Таблица
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.instruction}>
              Инструкция
            </a>
            <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.askQuestion}>
              Задать вопрос
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
