'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { intakeSchema, type IntakeFormData } from '@/lib/form-schema';

type LinksData = {
  folder: string;
  cheatsheet: string;
  table: string;
  instruction: string;
  askQuestion: string;
};

const initialValues: IntakeFormData = {
  name_contact: '',
  status: '',
  goal: '',
  skills: '',
  interests: '',
  dont_want: '',
  hours_per_week: '',
  participation_mode: '',
  roles_to_try: '',
  help_needed: '',
  constraints: '',
  comment: '',
  questions: '',
  website: ''
};

const requiredFields: Array<keyof IntakeFormData> = [
  'name_contact',
  'status',
  'goal',
  'skills',
  'interests',
  'dont_want',
  'hours_per_week',
  'participation_mode',
  'roles_to_try',
  'help_needed',
  'constraints'
];

export function IntakeForm({ token }: { token: string }) {
  const [links, setLinks] = useState<LinksData | null>(null);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: initialValues,
    mode: 'onChange'
  });

  const watched = watch();
  const filled = useMemo(() => {
    const count = requiredFields.filter((field) => String(watched[field] ?? '').trim().length > 0).length;
    return Math.round((count / requiredFields.length) * 100);
  }, [watched]);

  useEffect(() => {
    async function loadLinks() {
      try {
        const response = await fetch('/api/links', {
          headers: {
            'x-access-token': token
          }
        });
        const json = await response.json();
        if (json.ok) {
          setLinks(json.data);
        }
      } finally {
        setIsLoadingLinks(false);
      }
    }

    loadLinks();
  }, [token]);

  const onSubmit = handleSubmit(async (data) => {
    setServerMessage('Сохраняем данные...');
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch('/api/submissions/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
        'x-idempotency-key': idempotencyKey
      },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
      setServerMessage(`Ошибка: ${json.error ?? 'не удалось сохранить форму'}`);
      return;
    }

    setServerMessage(
      json.operation === 'insert'
        ? `Готово: создана новая запись (строка ${json.rowNumber}).`
        : `Готово: обновлена ваша запись (строка ${json.rowNumber}).`
    );
  });

  return (
    <main className="mx-auto max-w-4xl px-4 pb-28 pt-8">
      <section className="section-card animate-floatIn">
        <h1 className="text-3xl font-semibold tracking-tight">Анкета команды</h1>
        <p className="mt-3 text-slate-600">
          Заполните форму один раз. Если захотите изменить ответы позже — просто отправьте снова с тем же Telegram/Email.
        </p>
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${filled}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Прогресс заполнения: {filled}%</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="section-card">
          <h2 className="font-semibold">Что это</h2>
          <p className="mt-2 text-sm text-slate-600">Форма помогает быстро собрать роли, навыки и доступность команды в одной таблице.</p>
        </div>
        <div className="section-card">
          <h2 className="font-semibold">Как заполнить</h2>
          <p className="mt-2 text-sm text-slate-600">Отвечайте честно и коротко. Важно указать реальный контакт и время в неделю.</p>
        </div>
        <div className="section-card">
          <h2 className="font-semibold">Полезные ссылки</h2>
          <p className="mt-2 text-sm text-slate-600">Шпаргалка, таблица и инструкция всегда под рукой внизу экрана.</p>
        </div>
      </section>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="section-card">
          <label className="field-label" htmlFor="name_contact">Имя + Telegram/Email</label>
          <input id="name_contact" className="field-input" placeholder="Например: Анна @anna_team или anna@mail.com" {...register('name_contact')} />
          <p className="field-hint">Этот контакт используется как ключ обновления вашей записи.</p>
          {errors.name_contact ? <p className="mt-1 text-xs text-red-600">{errors.name_contact.message}</p> : null}
        </div>

        <div className="section-card grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="status">Статус участия</label>
            <select id="status" className="field-input" {...register('status')}>
              <option value="">Выберите вариант</option>
              <option>Активное ядро</option>
              <option>Могу помогать задачами</option>
              <option>Резерв</option>
              <option>Наблюдаю</option>
              <option>На паузе</option>
            </select>
            {errors.status ? <p className="mt-1 text-xs text-red-600">{errors.status.message}</p> : null}
          </div>
          <div>
            <label className="field-label" htmlFor="hours_per_week">Время в неделю</label>
            <input id="hours_per_week" className="field-input" placeholder="Например: 3-5 часов" {...register('hours_per_week')} />
            {errors.hours_per_week ? <p className="mt-1 text-xs text-red-600">{errors.hours_per_week.message}</p> : null}
          </div>
        </div>

        {(
          [
            ['goal', 'Что хотите получить от проекта', 'Опыт, кейсы, практика, обучение...'],
            ['skills', 'Что умеете делать сейчас', 'Навыки, инструменты, реальные примеры...'],
            ['interests', 'Что интересно делать', 'Направления и задачи, которые хочется брать...'],
            ['dont_want', 'Что точно не хотите делать', 'Важно, чтобы задачи были комфортными...'],
            ['participation_mode', 'Формат участия', 'Постоянная роль / отдельные задачи / консультация...'],
            ['roles_to_try', 'Какие роли или задачи хотите попробовать', 'Укажите конкретные подзадачи...'],
            ['help_needed', 'Где нужна помощь или обучение', 'Что нужно объяснить, показать или дать шаблон...'],
            ['constraints', 'Ограничения', 'График, семейные обстоятельства, неудобные форматы связи...'],
            ['comment', 'Комментарий (опционально)', 'Любые мысли, риски, предложения...'],
            ['questions', 'Вопросы (опционально)', 'Если есть вопросы к организатору...']
          ] as const
        ).map(([name, title, hint]) => (
          <div className="section-card" key={name}>
            <label className="field-label" htmlFor={name}>{title}</label>
            <textarea id={name} className="field-input min-h-28" placeholder={hint} {...register(name)} />
            <p className="field-hint">{hint}</p>
            {errors[name] ? <p className="mt-1 text-xs text-red-600">{errors[name]?.message}</p> : null}
          </div>
        ))}

        <input className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить анкету'}
        </button>

        {serverMessage ? <p className="text-sm text-slate-700">{serverMessage}</p> : null}
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 px-4 py-3">
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.cheatsheet ?? '#'} target="_blank" rel="noreferrer">
            Открыть шпаргалку
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.table ?? '#'} target="_blank" rel="noreferrer">
            Открыть таблицу вручную
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.askQuestion ?? '#'} target="_blank" rel="noreferrer">
            Задать вопрос
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.instruction ?? '#'} target="_blank" rel="noreferrer">
            Инструкция
          </a>
          {isLoadingLinks ? <span className="text-xs text-slate-500">Загружаем ссылки...</span> : null}
        </div>
      </div>
    </main>
  );
}
