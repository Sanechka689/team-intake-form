#!/usr/bin/env node

const NOTION_API_BASE_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const notionToken = process.env.NOTION_TOKEN;
const parentPageInput = process.env.NOTION_PARENT_PAGE_ID;
const lifeOsPageTitle = process.env.LIFEOS_PAGE_TITLE || "LifeOS";

if (!notionToken || !parentPageInput) {
  console.error("Missing required environment variables.");
  console.error("Set NOTION_TOKEN and NOTION_PARENT_PAGE_ID before running.");
  process.exit(1);
}

const failedProperties = [];

function toUuid(value) {
  const cleaned = value.replace(/[^a-fA-F0-9]/g, "");
  if (cleaned.length !== 32) {
    throw new Error(`Unable to parse Notion ID from: ${value}`);
  }
  return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`.toLowerCase();
}

function extractNotionPageId(input) {
  const trimmed = input.trim();

  if (/^[a-fA-F0-9-]{32,36}$/.test(trimmed)) {
    return toUuid(trimmed);
  }

  const matched = trimmed.match(/[a-fA-F0-9]{32}(?=[^a-fA-F0-9]|$)/);
  if (!matched) {
    throw new Error(`Could not extract page ID from: ${input}`);
  }
  return toUuid(matched[0]);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function textRich(content) {
  return [{ type: "text", text: { content } }];
}

function selectOption(name, color) {
  return { name, color };
}

async function notionRequest(path, method = "GET", body = undefined, retries = 3) {
  const response = await fetch(`${NOTION_API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${notionToken}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 429 && retries > 0) {
    const retryAfter = Number(response.headers.get("retry-after") || "1");
    await sleep((retryAfter + 1) * 1000);
    return notionRequest(path, method, body, retries - 1);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = payload?.message || `HTTP ${response.status}`;
    throw new Error(`${method} ${path} failed: ${errorMessage}`);
  }

  return payload;
}

async function createPage(parentPageId, title) {
  return notionRequest("/pages", "POST", {
    parent: { page_id: parentPageId },
    icon: { type: "emoji", emoji: "🧭" },
    properties: {
      title: {
        title: textRich(title),
      },
    },
  });
}

async function createDatabase(parentPageId, title, description, properties) {
  return notionRequest("/databases", "POST", {
    parent: { page_id: parentPageId },
    title: textRich(title),
    description: textRich(description),
    properties,
  });
}

async function addProperty(databaseId, propertyName, propertySchema) {
  try {
    await notionRequest(`/databases/${databaseId}`, "PATCH", {
      properties: {
        [propertyName]: propertySchema,
      },
    });
    return true;
  } catch (error) {
    failedProperties.push({
      databaseId,
      propertyName,
      reason: error.message,
    });
    console.warn(`Warning: property '${propertyName}' was not created. ${error.message}`);
    return false;
  }
}

async function addProperties(databaseId, properties) {
  const entries = Object.entries(properties);
  for (const [name, schema] of entries) {
    await addProperty(databaseId, name, schema);
  }
}

async function createUiChecklistPage(parentPageId) {
  return notionRequest("/pages", "POST", {
    parent: { page_id: parentPageId },
    icon: { type: "emoji", emoji: "✅" },
    properties: {
      title: {
        title: textRich("LifeOS - UI Checklist"),
      },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: textRich("Что доделать в интерфейсе Notion (5-10 минут)") },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Создать views-зоны: Inbox, Backlog, Active, Week, Calendar, Projects, Eisenhower Matrix, Completed, Notes"), checked: false },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Для Active настроить фильтр статусов: Active/Scheduled/Waiting/Review/Blocked"), checked: false },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Для Week настроить фильтр: Плановая дата this week OR Дедлайн this week"), checked: false },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Создать 2 календаря: События по Период и Задачи по Плановая дата (опционально по Дедлайн)"), checked: false },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Eisenhower Matrix: board из Задач, группировка по Квадрант, исключить Done/Canceled"), checked: false },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Проверить цвета select-полей: Статус, Приоритет, Категория, Контекст"), checked: false },
      },
      {
        object: "block",
        type: "to_do",
        to_do: { rich_text: textRich("Создать шаблоны: Новая задача и Meeting note"), checked: false },
      },
    ],
  });
}

async function main() {
  const parentPageId = extractNotionPageId(parentPageInput);
  console.log(`Parent page ID: ${parentPageId}`);
  console.log("Creating LifeOS page...");

  const lifeOsPage = await createPage(parentPageId, lifeOsPageTitle);
  const lifeOsPageId = lifeOsPage.id;
  console.log(`Created page: ${lifeOsPage.url}`);

  console.log("Creating databases...");

  const projectsDb = await createDatabase(
    lifeOsPageId,
    "Проекты",
    "Основные проекты LifeOS",
    {
      Название: { title: {} },
      "Статус проекта": {
        select: {
          options: [
            selectOption("Active", "green"),
            selectOption("On hold", "yellow"),
            selectOption("Completed", "blue"),
            selectOption("Someday", "gray"),
          ],
        },
      },
      Сфера: {
        select: {
          options: [
            selectOption("Work", "purple"),
            selectOption("Personal", "pink"),
            selectOption("Health", "green"),
            selectOption("Learning", "blue"),
          ],
        },
      },
      Старт: { date: {} },
      "Цель до": { date: {} },
      Результат: { rich_text: {} },
      "AI Context": { rich_text: {} },
    },
  );

  const tasksDb = await createDatabase(
    lifeOsPageId,
    "Задачи",
    "Единая база задач и подзадач",
    {
      Задача: { title: {} },
      Статус: {
        select: {
          options: [
            selectOption("Inbox", "default"),
            selectOption("Backlog", "gray"),
            selectOption("Active", "green"),
            selectOption("Scheduled", "blue"),
            selectOption("Waiting", "yellow"),
            selectOption("Review", "purple"),
            selectOption("Blocked", "red"),
            selectOption("Someday", "brown"),
            selectOption("Done", "green"),
            selectOption("Canceled", "gray"),
          ],
        },
      },
      Дедлайн: { date: {} },
      "Плановая дата": { date: {} },
      Приоритет: {
        select: {
          options: [
            selectOption("P1", "red"),
            selectOption("P2", "orange"),
            selectOption("P3", "yellow"),
            selectOption("P4", "gray"),
          ],
        },
      },
      Важность: { number: { format: "number" } },
      Срочность: { number: { format: "number" } },
      Квадрант: {
        formula: {
          expression:
            'if(and(prop("Важность") >= 3, prop("Срочность") >= 3), "Q1 Делать", if(and(prop("Важность") >= 3, prop("Срочность") < 3), "Q2 Планировать", if(and(prop("Важность") < 3, prop("Срочность") >= 3), "Q3 Делегировать", "Q4 Убрать")))',
        },
      },
      "План, ч": { number: { format: "number" } },
      Контекст: {
        multi_select: {
          options: [
            selectOption("Office", "blue"),
            selectOption("Home", "green"),
            selectOption("Calls", "orange"),
            selectOption("Errands", "pink"),
            selectOption("Deep Work", "purple"),
          ],
        },
      },
      "Завершено в": { date: {} },
      "AI Context": { rich_text: {} },
    },
  );

  const eventsDb = await createDatabase(
    lifeOsPageId,
    "События",
    "Календарные события и work blocks",
    {
      Событие: { title: {} },
      Период: { date: {} },
      Категория: {
        select: {
          options: [
            selectOption("Meeting", "blue"),
            selectOption("Trip", "orange"),
            selectOption("Workout", "green"),
            selectOption("Personal", "pink"),
            selectOption("Work block", "purple"),
          ],
        },
      },
      Место: { rich_text: {} },
      "План, ч": {
        formula: {
          expression:
            'if(or(empty(start(prop("Период"))), empty(end(prop("Период")))), 0, round(dateBetween(end(prop("Период")), start(prop("Период")), "minutes") / 60 * 100) / 100)',
        },
      },
    },
  );

  const notesDb = await createDatabase(
    lifeOsPageId,
    "Заметки",
    "Заметки, идеи, meeting notes и решения",
    {
      Заметка: { title: {} },
      Тип: {
        select: {
          options: [
            selectOption("Inbox", "default"),
            selectOption("Meeting note", "blue"),
            selectOption("Idea", "yellow"),
            selectOption("Reference", "gray"),
            selectOption("Decision", "green"),
          ],
        },
      },
      Кратко: { rich_text: {} },
      Создано: { created_time: {} },
    },
  );

  const sessionsDb = await createDatabase(
    lifeOsPageId,
    "Сессии времени",
    "Фактические сессии выполнения задач",
    {
      Сессия: { title: {} },
      Начало: { date: {} },
      Конец: { date: {} },
      "Длительность, ч": {
        formula: {
          expression: 'round(dateBetween(prop("Конец"), prop("Начало"), "minutes") / 60 * 100) / 100',
        },
      },
      Дата: {
        formula: {
          expression: 'formatDate(prop("Начало"), "YYYY-MM-DD")',
        },
      },
      Комментарий: { rich_text: {} },
    },
  );

  console.log("Databases created:");
  console.log(`- Проекты: ${projectsDb.url}`);
  console.log(`- Задачи: ${tasksDb.url}`);
  console.log(`- События: ${eventsDb.url}`);
  console.log(`- Заметки: ${notesDb.url}`);
  console.log(`- Сессии времени: ${sessionsDb.url}`);

  console.log("Adding cross-database relations and rollups...");

  await addProperties(tasksDb.id, {
    Проект: { relation: { database_id: projectsDb.id, single_property: {} } },
    "Родительская задача": { relation: { database_id: tasksDb.id, single_property: {} } },
    События: { relation: { database_id: eventsDb.id, single_property: {} } },
    Заметки: { relation: { database_id: notesDb.id, single_property: {} } },
    Сессии: { relation: { database_id: sessionsDb.id, single_property: {} } },
    "Факт, ч": {
      rollup: {
        relation_property_name: "Сессии",
        rollup_property_name: "Длительность, ч",
        function: "sum",
      },
    },
    "Отклонение, ч": {
      formula: {
        expression: 'round((prop("Факт, ч") - prop("План, ч")) * 100) / 100',
      },
    },
  });

  await addProperties(eventsDb.id, {
    Проект: { relation: { database_id: projectsDb.id, single_property: {} } },
    "Связанная задача": { relation: { database_id: tasksDb.id, single_property: {} } },
    Заметки: { relation: { database_id: notesDb.id, single_property: {} } },
  });

  await addProperties(notesDb.id, {
    Проект: { relation: { database_id: projectsDb.id, single_property: {} } },
    Задача: { relation: { database_id: tasksDb.id, single_property: {} } },
    Событие: { relation: { database_id: eventsDb.id, single_property: {} } },
  });

  await addProperties(sessionsDb.id, {
    Задача: { relation: { database_id: tasksDb.id, single_property: {} } },
  });

  await addProperties(projectsDb.id, {
    Задачи: { relation: { database_id: tasksDb.id, single_property: {} } },
    События: { relation: { database_id: eventsDb.id, single_property: {} } },
    Заметки: { relation: { database_id: notesDb.id, single_property: {} } },
    "План, ч": {
      rollup: {
        relation_property_name: "Задачи",
        rollup_property_name: "План, ч",
        function: "sum",
      },
    },
    "Факт, ч": {
      rollup: {
        relation_property_name: "Задачи",
        rollup_property_name: "Факт, ч",
        function: "sum",
      },
    },
    "Статусы задач": {
      rollup: {
        relation_property_name: "Задачи",
        rollup_property_name: "Статус",
        function: "show_original",
      },
    },
    "Открыто задач": {
      formula: {
        expression:
          'if(empty(prop("Статусы задач")), 0, length(filter(prop("Статусы задач"), current != "Done" and current != "Canceled")))',
      },
    },
    "Завершено задач": {
      formula: {
        expression: 'if(empty(prop("Статусы задач")), 0, length(filter(prop("Статусы задач"), current == "Done")))',
      },
    },
  });

  const checklistPage = await createUiChecklistPage(lifeOsPageId);

  console.log("LifeOS provisioning finished.");
  console.log(`LifeOS page: ${lifeOsPage.url}`);
  console.log(`UI checklist: ${checklistPage.url}`);

  if (failedProperties.length > 0) {
    console.log("\nSome properties were skipped and need manual setup:");
    for (const item of failedProperties) {
      console.log(`- [${item.databaseId}] ${item.propertyName}: ${item.reason}`);
    }
  }
}

main().catch((error) => {
  console.error("\nLifeOS provisioning failed.");
  console.error(error.message);
  process.exit(1);
});
