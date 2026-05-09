import Link from 'next/link';
import { getAppLinks } from '@/lib/links';

export default function InstructionPage() {
  const links = getAppLinks();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="section-card">
        <h1 className="text-3xl font-semibold tracking-tight">Пошаговая инструкция</h1>
        <p className="mt-3 text-slate-600">
          Здесь все шаги для команды: что нажимать, как заполнять и как убедиться, что данные ушли в таблицу.
        </p>
      </section>

      <section className="mt-6 section-card">
        <h2 className="text-xl font-semibold">Шаги</h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-700">
          <li><strong>1.</strong> Откройте анкету по кнопке ниже.</li>
          <li><strong>2.</strong> Заполните все обязательные поля (контакт, статус, цели, навыки и т.д.).</li>
          <li><strong>3.</strong> Нажмите «Отправить анкету» и дождитесь сообщения с номером строки и `request_id`.</li>
        </ol>
        <div className="mt-4">
          <Link
            href="/form"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Начни отсюда
          </Link>
        </div>
      </section>

      <section id="materials" className="mt-6 section-card">
        <h2 className="text-xl font-semibold">Материалы проекта</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <a id="folder" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.folder}>
            Папка проекта
          </a>
          <a id="cheatsheet" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.cheatsheet}>
            Шпаргалка
          </a>
          <a id="table" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.table}>
            Таблица
          </a>
          <a id="contacts" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links.askQuestion}>
            Задать вопрос
          </a>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Если кнопка открыла эту страницу, значит внешняя ссылка ещё не задана в переменных Vercel.
        </p>
      </section>
    </main>
  );
}
