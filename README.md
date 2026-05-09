# Team Intake Form (Vercel + Google Sheets)

Простой и удобный сайт-анкета для команды: бриф, инструкция, подсказки и запись в таблицу.

## Что есть сейчас
- Главная страница с контекстом проекта и кнопкой `Начни отсюда`
- Страница формы `/form` с подсказками и валидацией
- Страница `/instruction` с пошаговой инструкцией
- Страница `/thanks` после отправки
- Фиксированное меню ссылок: папка, шпаргалка, таблица, инструкция, задать вопрос
- Логотип в шапке (клик возвращает на главную)

## Запись данных
`POST /api/submissions/upsert`

Логика:
1. Проверка и валидация данных (Zod)
2. Антиспам + rate limit
3. Запись через `GOOGLE_APPS_SCRIPT_URL` (если задан)
4. Иначе fallback на Google Sheets API через service account
5. Idempotency по `x-idempotency-key`

## Запуск локально
1. `cp .env.example .env.local`
2. Заполнить ENV
3. `npm install`
4. `npm run dev`

## Обязательные ENV (минимум)
### Если используешь Apps Script (рекомендуется)
- `GOOGLE_APPS_SCRIPT_URL`
- `GOOGLE_APPS_SCRIPT_SECRET`
- `LINK_FOLDER`, `LINK_CHEATSHEET`, `LINK_TABLE`, `LINK_INSTRUCTION`, `LINK_ASK_QUESTION`

### Если используешь прямой Google Sheets API
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `SHEET_PARTICIPANTS_TAB`, `SHEET_AUDIT_TAB`

## Важный момент по таблице
- Строка 1: человекочитаемые заголовки
- Строка 2: `field_key`
- Данные с `SHEET_DATA_START_ROW` (по умолчанию 3)

Поддерживаемые `field_key`:
`name_contact,status,goal,skills,interests,dont_want,hours_per_week,participation_mode,roles_to_try,help_needed,constraints,comment,questions`

Рекомендуемые тех-колонки:
`telegram_or_email`, `updated_at`, `last_request_id`
