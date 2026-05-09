import Link from 'next/link';
import { getProjectLinks } from '@/lib/links';

const steps = [
  {
    title: 'Откройте анкету',
    text: 'Нажмите «Начни отсюда» на главной странице. Никакие ключи и коды не нужны.'
  },
  {
    title: 'Подготовьте 3 вещи заранее',
    text: 'Контакт (Telegram или Email), примерную загрузку в неделю и список задач, которые вам интересны.'
  },
  {
    title: 'Заполните обязательные поля',
    text: 'Поля со статусом, целями, навыками и ограничениями нужны для корректного распределения задач в команде.'
  },
  {
    title: 'Используйте шпаргалку',
    text: 'Если сомневаетесь в формулировке, откройте шпаргалку — там примеры коротких и полезных ответов.'
  },
  {
    title: 'Проверьте контакт',
    text: 'Это ключ записи: если отправите форму повторно с тем же контактом, система обновит старую строку, а не создаст дубль.'
  },
  {
    title: 'Нажмите «Отправить анкету»',
    text: 'После отправки откроется экран подтверждения. Это значит, что данные записаны и доступны координатору в таблице.'
  },
  {
    title: 'Если нужна правка',
    text: 'Просто снова откройте форму и отправьте её с тем же Telegram/Email — изменения перезапишут вашу текущую запись.'
  }
];

export default function InstructionPage() {
  const links = getProjectLinks();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
      <section className="section-card bg-gradient-to-br from-white via-blue-50 to-cyan-50">
        <h1 className="text-3xl font-semibold tracking-tight">Пошаговая инструкция</h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          Ниже вся логика заполнения анкеты в простом порядке. Если следовать этим шагам, данные точно попадут в нужные колонки таблицы.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <article className="section-card" key={step.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Шаг {index + 1}</p>
            <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{step.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 section-card">
        <h2 className="text-lg font-semibold">Быстрые ссылки</h2>
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
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.askQuestion}>
            Задать вопрос
          </a>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/form" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Перейти к анкете
          </Link>
          <Link href="/" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Вернуться на главную
          </Link>
        </div>
      </section>
    </main>
  );
}
