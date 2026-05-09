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
            Эта анкета помогает нам понять, кто чем хочет заниматься, сколько времени готов выделять и где нужна поддержка. На основе ответов мы
            формируем роли, распределяем задачи и запускаем работу без хаоса и лишних переписок.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
            Внутри всё сделано максимально просто: подсказки в каждом поле, пошаговая инструкция, быстрые ссылки на материалы и запись ответов в
            Google-таблицу.
          </p>

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
