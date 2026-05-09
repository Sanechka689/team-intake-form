# Team Intake Website (Vercel + Google Sheets / Apps Script)

Минималистичный сайт-анкета для команды с подсказками и надёжной записью в Google Sheet.

## Stack
- Next.js 14 + TypeScript + Tailwind
- React Hook Form + Zod
- Google Sheets API (`googleapis`)
- Google Apps Script Webhook (recommended)

## Быстрый старт
1. Скопировать `.env.example` в `.env.local` и заполнить переменные.
2. Установить зависимости: `npm install`.
3. Запустить: `npm run dev`.
4. Открыть сайт на `/` (стартовый экран) или приватный маршрут `/s/<APP_SECRET>`.

## Подготовка таблицы
1. Конвертировать исходный `.xlsm` в нативный Google Sheet.
2. Создать листы:
   - `Анкеты участников`
   - `Вопросы и решения`
   - `audit_log`
3. На листе `Анкеты участников`:
   - Строка 1 — человекочитаемые заголовки.
   - Строка 2 — `field_key` для API (минимум):
     `name_contact,status,goal,skills,interests,dont_want,hours_per_week,participation_mode,roles_to_try,help_needed,constraints,comment,questions`
   - Рекомендуется добавить `telegram_or_email`, `updated_at`, `last_request_id`.

## API
- `GET /api/links` — ссылки для интерфейса (требует `x-access-token`).
- `POST /api/submissions/upsert` — upsert анкеты (требует `x-access-token`).

`POST /api/submissions/upsert` поддерживает 2 режима:
1. **Apps Script webhook** (приоритетный), если задан `GOOGLE_APPS_SCRIPT_URL`.
2. **Прямой Google Sheets API** через service account (legacy fallback).

Response:
`{ ok, operation: "insert"|"update", rowNumber, requestId, savedAt }`

## Надёжность
- Валидация на клиенте и сервере.
- Upsert по нормализованному контакту.
- Idempotency (`x-idempotency-key`).
- Retry c backoff.
- Read-after-write проверка.
- `audit_log` на каждую операцию.
- Honeypot + rate limit + антиспам.

## Deploy (Vercel)
1. Подключить GitHub репозиторий.
2. Вставить все ENV из `.env.example` в Vercel Project Settings.
3. Проверить Preview deployment.
4. Проверить запись в тестовую таблицу.
5. Перевести в Production.

## Важные ENV для доступа
- `APP_SECRET` — обязательный ключ доступа для маршрута `/s/<key>` и API.
- `DEFAULT_FORM_PATH` — опционально, например `/s/<ваш_ключ>`, чтобы на стартовом экране была кнопка прямого перехода.
- `GOOGLE_APPS_SCRIPT_URL` — URL развернутого Apps Script (`.../exec`).
- `GOOGLE_APPS_SCRIPT_SECRET` — должен совпадать со `WEBHOOK_SECRET` в Script Properties Apps Script.
