#!/usr/bin/env python3

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

NOTION_API_BASE_URL = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_PARENT_PAGE_ID = os.getenv("NOTION_PARENT_PAGE_ID")
LIFEOS_PAGE_TITLE = os.getenv("LIFEOS_PAGE_TITLE", "LifeOS")

if not NOTION_TOKEN or not NOTION_PARENT_PAGE_ID:
    print("Missing required environment variables.", file=sys.stderr)
    print("Set NOTION_TOKEN and NOTION_PARENT_PAGE_ID before running.", file=sys.stderr)
    sys.exit(1)

failed_properties = []


def text_rich(content):
    return [{"type": "text", "text": {"content": content}}]


def select_option(name, color):
    return {"name": name, "color": color}


def to_uuid(raw_value):
    cleaned = re.sub(r"[^a-fA-F0-9]", "", raw_value)
    if len(cleaned) != 32:
        raise ValueError(f"Unable to parse Notion ID from: {raw_value}")
    return (
        f"{cleaned[0:8]}-{cleaned[8:12]}-{cleaned[12:16]}-"
        f"{cleaned[16:20]}-{cleaned[20:32]}"
    ).lower()


def extract_notion_page_id(value):
    trimmed = value.strip()
    if re.fullmatch(r"[a-fA-F0-9-]{32,36}", trimmed):
        return to_uuid(trimmed)

    matched = re.search(r"([a-fA-F0-9]{32})(?=[^a-fA-F0-9]|$)", trimmed)
    if not matched:
        raise ValueError(f"Could not extract page ID from: {value}")
    return to_uuid(matched.group(1))


def notion_request(path, method="GET", body=None, retries=3):
    url = f"{NOTION_API_BASE_URL}{path}"
    payload = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(url=url, data=payload, method=method)
    request.add_header("Authorization", f"Bearer {NOTION_TOKEN}")
    request.add_header("Notion-Version", NOTION_VERSION)
    request.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        body_text = error.read().decode("utf-8") if error.fp else ""
        error_payload = {}
        if body_text:
            try:
                error_payload = json.loads(body_text)
            except json.JSONDecodeError:
                error_payload = {}

        if error.code == 429 and retries > 0:
            retry_after = int(error.headers.get("retry-after", "1"))
            time.sleep(retry_after + 1)
            return notion_request(path, method, body, retries - 1)

        message = error_payload.get("message") or f"HTTP {error.code}"
        raise RuntimeError(f"{method} {path} failed: {message}") from error


def create_page(parent_page_id, title):
    return notion_request(
        "/pages",
        "POST",
        {
            "parent": {"page_id": parent_page_id},
            "icon": {"type": "emoji", "emoji": "🧭"},
            "properties": {"title": {"title": text_rich(title)}},
        },
    )


def create_database(parent_page_id, title, description, properties):
    return notion_request(
        "/databases",
        "POST",
        {
            "parent": {"page_id": parent_page_id},
            "title": text_rich(title),
            "description": text_rich(description),
            "properties": properties,
        },
    )


def add_property(database_id, property_name, property_schema):
    try:
        notion_request(
            f"/databases/{database_id}",
            "PATCH",
            {"properties": {property_name: property_schema}},
        )
        return True
    except Exception as error:  # noqa: BLE001
        failed_properties.append(
            {
                "databaseId": database_id,
                "propertyName": property_name,
                "reason": str(error),
            }
        )
        print(
            f"Warning: property '{property_name}' was not created. {error}",
            file=sys.stderr,
        )
        return False


def add_properties(database_id, properties):
    for name, schema in properties.items():
        add_property(database_id, name, schema)


def create_ui_checklist_page(parent_page_id):
    children = [
        {
            "object": "block",
            "type": "heading_2",
            "heading_2": {"rich_text": text_rich("Что доделать в интерфейсе Notion (5-10 минут)")},
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Создать views-зоны: Inbox, Backlog, Active, Week, Calendar, Projects, Eisenhower Matrix, Completed, Notes"),
                "checked": False,
            },
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Для Active настроить фильтр статусов: Active/Scheduled/Waiting/Review/Blocked"),
                "checked": False,
            },
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Для Week настроить фильтр: Плановая дата this week OR Дедлайн this week"),
                "checked": False,
            },
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Создать 2 календаря: События по Период и Задачи по Плановая дата (опционально по Дедлайн)"),
                "checked": False,
            },
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Eisenhower Matrix: board из Задач, группировка по Квадрант, исключить Done/Canceled"),
                "checked": False,
            },
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Проверить цвета select-полей: Статус, Приоритет, Категория, Контекст"),
                "checked": False,
            },
        },
        {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": text_rich("Создать шаблоны: Новая задача и Meeting note"),
                "checked": False,
            },
        },
    ]

    return notion_request(
        "/pages",
        "POST",
        {
            "parent": {"page_id": parent_page_id},
            "icon": {"type": "emoji", "emoji": "✅"},
            "properties": {"title": {"title": text_rich("LifeOS - UI Checklist")}},
            "children": children,
        },
    )


def main():
    parent_page_id = extract_notion_page_id(NOTION_PARENT_PAGE_ID)
    print(f"Parent page ID: {parent_page_id}")
    print("Creating LifeOS page...")
    lifeos_page = create_page(parent_page_id, LIFEOS_PAGE_TITLE)
    lifeos_page_id = lifeos_page["id"]
    print(f"Created page: {lifeos_page.get('url')}")

    print("Creating databases...")

    projects_db = create_database(
        lifeos_page_id,
        "Проекты",
        "Основные проекты LifeOS",
        {
            "Название": {"title": {}},
            "Статус проекта": {
                "select": {
                    "options": [
                        select_option("Active", "green"),
                        select_option("On hold", "yellow"),
                        select_option("Completed", "blue"),
                        select_option("Someday", "gray"),
                    ]
                }
            },
            "Сфера": {
                "select": {
                    "options": [
                        select_option("Work", "purple"),
                        select_option("Personal", "pink"),
                        select_option("Health", "green"),
                        select_option("Learning", "blue"),
                    ]
                }
            },
            "Старт": {"date": {}},
            "Цель до": {"date": {}},
            "Результат": {"rich_text": {}},
            "AI Context": {"rich_text": {}},
        },
    )

    tasks_db = create_database(
        lifeos_page_id,
        "Задачи",
        "Единая база задач и подзадач",
        {
            "Задача": {"title": {}},
            "Статус": {
                "select": {
                    "options": [
                        select_option("Inbox", "default"),
                        select_option("Backlog", "gray"),
                        select_option("Active", "green"),
                        select_option("Scheduled", "blue"),
                        select_option("Waiting", "yellow"),
                        select_option("Review", "purple"),
                        select_option("Blocked", "red"),
                        select_option("Someday", "brown"),
                        select_option("Done", "green"),
                        select_option("Canceled", "gray"),
                    ]
                }
            },
            "Дедлайн": {"date": {}},
            "Плановая дата": {"date": {}},
            "Приоритет": {
                "select": {
                    "options": [
                        select_option("P1", "red"),
                        select_option("P2", "orange"),
                        select_option("P3", "yellow"),
                        select_option("P4", "gray"),
                    ]
                }
            },
            "Важность": {"number": {"format": "number"}},
            "Срочность": {"number": {"format": "number"}},
            "Квадрант": {
                "formula": {
                    "expression": 'if(and(prop("Важность") >= 3, prop("Срочность") >= 3), "Q1 Делать", if(and(prop("Важность") >= 3, prop("Срочность") < 3), "Q2 Планировать", if(and(prop("Важность") < 3, prop("Срочность") >= 3), "Q3 Делегировать", "Q4 Убрать")))'
                }
            },
            "План, ч": {"number": {"format": "number"}},
            "Контекст": {
                "multi_select": {
                    "options": [
                        select_option("Office", "blue"),
                        select_option("Home", "green"),
                        select_option("Calls", "orange"),
                        select_option("Errands", "pink"),
                        select_option("Deep Work", "purple"),
                    ]
                }
            },
            "Завершено в": {"date": {}},
            "AI Context": {"rich_text": {}},
        },
    )

    events_db = create_database(
        lifeos_page_id,
        "События",
        "Календарные события и work blocks",
        {
            "Событие": {"title": {}},
            "Период": {"date": {}},
            "Категория": {
                "select": {
                    "options": [
                        select_option("Meeting", "blue"),
                        select_option("Trip", "orange"),
                        select_option("Workout", "green"),
                        select_option("Personal", "pink"),
                        select_option("Work block", "purple"),
                    ]
                }
            },
            "Место": {"rich_text": {}},
            "План, ч": {
                "formula": {
                    "expression": 'if(or(empty(start(prop("Период"))), empty(end(prop("Период")))), 0, round(dateBetween(end(prop("Период")), start(prop("Период")), "minutes") / 60 * 100) / 100)'
                }
            },
        },
    )

    notes_db = create_database(
        lifeos_page_id,
        "Заметки",
        "Заметки, идеи, meeting notes и решения",
        {
            "Заметка": {"title": {}},
            "Тип": {
                "select": {
                    "options": [
                        select_option("Inbox", "default"),
                        select_option("Meeting note", "blue"),
                        select_option("Idea", "yellow"),
                        select_option("Reference", "gray"),
                        select_option("Decision", "green"),
                    ]
                }
            },
            "Кратко": {"rich_text": {}},
            "Создано": {"created_time": {}},
        },
    )

    sessions_db = create_database(
        lifeos_page_id,
        "Сессии времени",
        "Фактические сессии выполнения задач",
        {
            "Сессия": {"title": {}},
            "Начало": {"date": {}},
            "Конец": {"date": {}},
            "Длительность, ч": {
                "formula": {
                    "expression": 'round(dateBetween(prop("Конец"), prop("Начало"), "minutes") / 60 * 100) / 100'
                }
            },
            "Дата": {"formula": {"expression": 'formatDate(prop("Начало"), "YYYY-MM-DD")'}},
            "Комментарий": {"rich_text": {}},
        },
    )

    print("Databases created:")
    print(f"- Проекты: {projects_db.get('url')}")
    print(f"- Задачи: {tasks_db.get('url')}")
    print(f"- События: {events_db.get('url')}")
    print(f"- Заметки: {notes_db.get('url')}")
    print(f"- Сессии времени: {sessions_db.get('url')}")

    print("Adding cross-database relations and rollups...")

    add_properties(
        tasks_db["id"],
        {
            "Проект": {"relation": {"database_id": projects_db["id"], "single_property": {}}},
            "Родительская задача": {"relation": {"database_id": tasks_db["id"], "single_property": {}}},
            "События": {"relation": {"database_id": events_db["id"], "single_property": {}}},
            "Заметки": {"relation": {"database_id": notes_db["id"], "single_property": {}}},
            "Сессии": {"relation": {"database_id": sessions_db["id"], "single_property": {}}},
            "Факт, ч": {
                "rollup": {
                    "relation_property_name": "Сессии",
                    "rollup_property_name": "Длительность, ч",
                    "function": "sum",
                }
            },
            "Отклонение, ч": {"formula": {"expression": 'round((prop("Факт, ч") - prop("План, ч")) * 100) / 100'}},
        },
    )

    add_properties(
        events_db["id"],
        {
            "Проект": {"relation": {"database_id": projects_db["id"], "single_property": {}}},
            "Связанная задача": {"relation": {"database_id": tasks_db["id"], "single_property": {}}},
            "Заметки": {"relation": {"database_id": notes_db["id"], "single_property": {}}},
        },
    )

    add_properties(
        notes_db["id"],
        {
            "Проект": {"relation": {"database_id": projects_db["id"], "single_property": {}}},
            "Задача": {"relation": {"database_id": tasks_db["id"], "single_property": {}}},
            "Событие": {"relation": {"database_id": events_db["id"], "single_property": {}}},
        },
    )

    add_properties(
        sessions_db["id"],
        {"Задача": {"relation": {"database_id": tasks_db["id"], "single_property": {}}}},
    )

    add_properties(
        projects_db["id"],
        {
            "Задачи": {"relation": {"database_id": tasks_db["id"], "single_property": {}}},
            "События": {"relation": {"database_id": events_db["id"], "single_property": {}}},
            "Заметки": {"relation": {"database_id": notes_db["id"], "single_property": {}}},
            "План, ч": {
                "rollup": {
                    "relation_property_name": "Задачи",
                    "rollup_property_name": "План, ч",
                    "function": "sum",
                }
            },
            "Факт, ч": {
                "rollup": {
                    "relation_property_name": "Задачи",
                    "rollup_property_name": "Факт, ч",
                    "function": "sum",
                }
            },
            "Статусы задач": {
                "rollup": {
                    "relation_property_name": "Задачи",
                    "rollup_property_name": "Статус",
                    "function": "show_original",
                }
            },
            "Открыто задач": {
                "formula": {
                    "expression": 'if(empty(prop("Статусы задач")), 0, length(filter(prop("Статусы задач"), current != "Done" and current != "Canceled")))'
                }
            },
            "Завершено задач": {
                "formula": {
                    "expression": 'if(empty(prop("Статусы задач")), 0, length(filter(prop("Статусы задач"), current == "Done")))'
                }
            },
        },
    )

    checklist_page = create_ui_checklist_page(lifeos_page_id)

    print("LifeOS provisioning finished.")
    print(f"LifeOS page: {lifeos_page.get('url')}")
    print(f"UI checklist: {checklist_page.get('url')}")

    if failed_properties:
        print("\nSome properties were skipped and need manual setup:")
        for item in failed_properties:
            print(f"- [{item['databaseId']}] {item['propertyName']}: {item['reason']}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # noqa: BLE001
        print("\nLifeOS provisioning failed.", file=sys.stderr)
        print(str(error), file=sys.stderr)
        sys.exit(1)
