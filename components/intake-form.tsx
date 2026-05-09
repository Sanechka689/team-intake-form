'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const fieldItems: Array<{ name: keyof IntakeFormData; title: string; hint: string; rows?: number }> = [
  {
    name: 'goal',
    title: 'Что хотите получить от проекта',
    hint: 'Например: практика на реальных задачах, портфолио, рост в направлении контента/аналитики.',
    rows: 4
  },
  {
    name: 'skills',
    title: 'Что умеете делать сейчас',
    hint: 'Опишите конкретные навыки и инструменты: тексты, Canva, Figma, монтаж, аналитика, таргет и т.д.',
    rows: 4
  },
  {
    name: 'interests',
    title: 'Что интересно делать',
    hint: 'Какие задачи вам реально интересны на практике.',
    rows: 4
  },
  {
    name: 'dont_want',
    title: 'Что точно не хотите делать',
    hint: 'Это помогает не давать вам неподходящие задачи.',
    rows: 3
  },
  {
    name: 'participation_mode',
    title: 'Формат участия',
    hint: 'Постоянная роль / точечные задачи / консультации / смешанный формат.',
    rows: 3
  },
  {
    name: 'roles_to_try',
    title: 'Какие роли или задачи хотите попробовать',
    hint: 'Например: копирайтинг, лидогенерация, контент-план, продюсирование, визуал.',
    rows: 4
  },
  {
    name: 'help_needed',
    title: 'Где нужна помощь',
    hint: 'Что нужно объяснить, дать шаблон или проверить вместе.',
    rows: 3
  },
  {
    name: 'constraints',
    title: 'Ограничения',
    hint: 'График, занятость, неудобный формат связи и прочие ограничения.',
    rows: 3
  },
  {
    name: 'comment',
    title: 'Комментарий (опционально)',
    hint: 'Дополнительная информация, которую важно учитывать в работе.',
    rows: 3
  },
  {
    name: 'questions',
    title: 'Вопросы (опционально)',
    hint: 'Если остались вопросы к организатору, напишите их здесь.',
    rows: 3
  }
];

export function IntakeForm() {
  const router = useRouter();
  const [links, setLinks] = useState<LinksData | null>(null);
  const [serverError, setServerError] = useState<string>('');
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
        const response = await fetch('/api/links');
        const json = await response.json();
        if (json.ok) {
          setLinks(json.data);
        }
      } finally {
        setIsLoadingLinks(false);
      }
    }

    loadLinks();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setServerError('');
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch('/api/submissions/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': idempotencyKey
      },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    if (!response.ok || !json.ok) {
      const details = String(json?.details ?? '').trim();
      setServerError(`Ошибка отправки: ${json.error ?? 'не удалось сохранить форму'}${details ? `. ${details}` : ''}`);
      return;
    }

    router.push(`/thanks?operation=${json.operation}&row=${json.rowNumber}`);
  });

  return (
    <main className="mx-auto max-w-5xl px-4 pb-28 pt-8">
      <section className="section-card animate-floatIn bg-gradient-to-br from-white via-blue-50 to-cyan-50">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Анкета участника</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Заполнение займёт 5–10 минут</h1>
        <p className="mt-3 text-slate-600">
          Отвечайте коротко и по делу. Важнее честность и конкретика — по этим ответам мы распределяем задачи и роли в проекте.
        </p>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${filled}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Прогресс заполнения: {filled}%</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="section-card">
          <h2 className="font-semibold">Как заполнять</h2>
          <p className="mt-2 text-sm text-slate-600">Пишите простыми фразами и примерами. Не нужно «идеально» — важно понятно и честно.</p>
        </article>
        <article className="section-card">
          <h2 className="font-semibold">Что критично</h2>
          <p className="mt-2 text-sm text-slate-600">Проверьте Telegram/Email и доступность по времени. По этим данным идёт связь и распределение.</p>
        </article>
        <article className="section-card">
          <h2 className="font-semibold">Если нужна помощь</h2>
          <p className="mt-2 text-sm text-slate-600">Откройте пошаговую инструкцию или задайте вопрос координатору — ссылки доступны ниже.</p>
        </article>
      </section>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="section-card">
          <label className="field-label" htmlFor="name_contact">
            Имя + Telegram/Email
          </label>
          <input
            id="name_contact"
            className="field-input"
            placeholder="Например: Анна @anna_team или anna@mail.com"
            {...register('name_contact')}
          />
          <p className="field-hint">Используется как ключ: повторная отправка с этим контактом обновляет вашу строку в таблице.</p>
          {errors.name_contact ? <p className="mt-1 text-xs text-red-600">{errors.name_contact.message}</p> : null}
        </div>

        <div className="section-card grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="status">
              Статус участия
            </label>
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
            <label className="field-label" htmlFor="hours_per_week">
              Время в неделю
            </label>
            <input id="hours_per_week" className="field-input" placeholder="Например: 3–5 часов" {...register('hours_per_week')} />
            {errors.hours_per_week ? <p className="mt-1 text-xs text-red-600">{errors.hours_per_week.message}</p> : null}
          </div>
        </div>

        {fieldItems.map((field) => (
          <div className="section-card" key={field.name}>
            <label className="field-label" htmlFor={field.name}>
              {field.title}
            </label>
            <textarea
              id={field.name}
              rows={field.rows ?? 3}
              className="field-input min-h-24"
              placeholder={field.hint}
              {...register(field.name)}
            />
            <p className="field-hint">{field.hint}</p>
            {errors[field.name] ? <p className="mt-1 text-xs text-red-600">{errors[field.name]?.message}</p> : null}
          </div>
        ))}

        <input className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить анкету'}
        </button>

        {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-3">
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.folder ?? '/'}>
            Папка проекта
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.cheatsheet ?? '/'}>
            Шпаргалка
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.table ?? '/'}>
            Таблица
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.instruction ?? '/instruction'}>
            Инструкция
          </a>
          <a className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50" href={links?.askQuestion ?? '/'}>
            Задать вопрос
          </a>
          <Link className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700" href="/instruction">
            Пошаговая инструкция
          </Link>
          {isLoadingLinks ? <span className="text-xs text-slate-500">Загружаем ссылки...</span> : null}
        </div>
      </div>
    </main>
  );
}
