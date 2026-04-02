# LifeOS Notion Setup

This setup creates your LifeOS structure in Notion:

- `Проекты`
- `Задачи`
- `События`
- `Заметки`
- `Сессии времени`

It also creates a top-level `LifeOS` page and a child page `LifeOS - UI Checklist` with the remaining manual UI steps.

## 1) Prepare Notion integration

1. Create an internal Notion integration.
2. Copy integration token (`NOTION_TOKEN`).
3. Open the Notion page where LifeOS should be created.
4. Share that page with the integration (required).
5. Copy page URL or page ID (`NOTION_PARENT_PAGE_ID`).

## 2) Configure environment

Copy `.env.lifeos.example` to your local env file and fill values:

```bash
cp .env.lifeos.example .env.lifeos.local
```

## 3) Run provisioning

```bash
set -a
source .env.lifeos.local
set +a
python3 scripts/setup_lifeos_notion.py
```

Alternative one-liner:

```bash
NOTION_TOKEN=... NOTION_PARENT_PAGE_ID=... python3 scripts/setup_lifeos_notion.py
```

## 4) Expected result

After successful execution, terminal output includes URLs for:

- `LifeOS` page
- all 5 databases
- `LifeOS - UI Checklist` page

## 5) Notes about API limitations

- Database views (`Inbox`, `Backlog`, `Active`, etc.) are not fully configurable via public Notion API in one call.
- The script creates all data model entities and a checklist page so final view setup is fast and deterministic.

## 6) Verification flow

1. Create one task in `Задачи`.
2. Add two records in `Сессии времени` linked to that task.
3. Confirm `Факт, ч` in `Задачи` updates as sum.
4. Set `Важность` and `Срочность`, confirm `Квадрант` auto-calculates.
5. Create one note and link to project/task/event, verify relation visibility.
