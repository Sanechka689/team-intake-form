import { google } from 'googleapis';
import type { IntakeFormData } from '@/lib/form-schema';
import { dtoFieldKeys, extractContactKey } from '@/lib/form-schema';
import type { SheetService, UpsertInput, UpsertResult } from './types';

const PARTICIPANTS_SHEET = process.env.SHEET_PARTICIPANTS_TAB ?? 'Анкеты участников';
const AUDIT_SHEET = process.env.SHEET_AUDIT_TAB ?? 'audit_log';
const FIELD_KEY_ROW = 2;
const DATA_START_ROW = 3;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

function normalizePrivateKey(key: string): string {
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

function toColumnName(index: number): string {
  let num = index;
  let name = '';
  while (num > 0) {
    const remainder = (num - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    num = Math.floor((num - 1) / 26);
  }
  return name;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }
  throw lastError;
}

class GoogleSheetService implements SheetService {
  private readonly spreadsheetId: string;
  private readonly sheets;
  private headerMap: Map<string, number> | null = null;

  constructor() {
    const auth = new google.auth.JWT({
      email: getEnv('GOOGLE_CLIENT_EMAIL'),
      key: normalizePrivateKey(getEnv('GOOGLE_PRIVATE_KEY')),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = getEnv('GOOGLE_SHEET_ID');
  }

  private async ensureHeaderMap(): Promise<Map<string, number>> {
    if (this.headerMap) {
      return this.headerMap;
    }

    const result = await withRetry(() =>
      this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${PARTICIPANTS_SHEET}!1:${toColumnName(60)}${FIELD_KEY_ROW}`
      })
    );

    const values = result.data.values ?? [];
    const techRow = values[FIELD_KEY_ROW - 1] ?? [];
    const map = new Map<string, number>();

    techRow.forEach((value, index) => {
      const key = String(value ?? '').trim();
      if (key) {
        map.set(key, index + 1);
      }
    });

    const missingFields = dtoFieldKeys.filter((field) => !map.has(field));
    if (missingFields.length > 0) {
      throw new Error(`Field key mismatch in sheet. Missing: ${missingFields.join(', ')}`);
    }

    if (!map.has('telegram_or_email') && !map.has('name_contact')) {
      throw new Error('Sheet must contain field key "telegram_or_email" or "name_contact"');
    }

    this.headerMap = map;
    return map;
  }

  private buildRowValues(payload: IntakeFormData, contactKey: string, requestId: string, map: Map<string, number>): string[] {
    const maxIndex = Math.max(...Array.from(map.values()));
    const row = new Array(maxIndex).fill('');

    dtoFieldKeys.forEach((key) => {
      const column = map.get(key);
      if (!column) {
        return;
      }
      row[column - 1] = String(payload[key] ?? '');
    });

    const contactCol = map.get('telegram_or_email');
    if (contactCol) {
      row[contactCol - 1] = contactKey;
    }

    const updatedCol = map.get('updated_at');
    if (updatedCol) {
      row[updatedCol - 1] = new Date().toISOString();
    }

    const requestIdCol = map.get('last_request_id');
    if (requestIdCol) {
      row[requestIdCol - 1] = requestId;
    }

    return row;
  }

  private async findExistingRow(contactKey: string, map: Map<string, number>): Promise<number | null> {
    const keyCol = map.get('telegram_or_email') ?? map.get('name_contact');
    if (!keyCol) {
      return null;
    }

    const columnName = toColumnName(keyCol);
    const range = `${PARTICIPANTS_SHEET}!${columnName}${DATA_START_ROW}:${columnName}`;
    const result = await withRetry(() =>
      this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range
      })
    );

    const values = result.data.values ?? [];
    for (let index = 0; index < values.length; index += 1) {
      const cellValue = String(values[index]?.[0] ?? '');
      const normalizedCell = extractContactKey(cellValue);
      if (normalizedCell === contactKey) {
        return DATA_START_ROW + index;
      }
    }

    return null;
  }

  private async writeAuditLog(params: {
    requestId: string;
    operation: string;
    rowNumber: number | '';
    status: 'ok' | 'error';
    message: string;
    contactKey: string;
  }): Promise<void> {
    await withRetry(() =>
      this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${AUDIT_SHEET}!A:G`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[new Date().toISOString(), params.requestId, params.operation, params.rowNumber, params.status, params.message, params.contactKey]]
        }
      })
    );
  }

  private async verifyWrite(rowNumber: number, rowValues: string[]): Promise<void> {
    const maxColumnName = toColumnName(rowValues.length);
    const result = await withRetry(() =>
      this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${PARTICIPANTS_SHEET}!A${rowNumber}:${maxColumnName}${rowNumber}`
      })
    );

    const saved = result.data.values?.[0] ?? [];
    for (let index = 0; index < rowValues.length; index += 1) {
      const expected = rowValues[index] ?? '';
      if (!expected) {
        continue;
      }
      const actual = String(saved[index] ?? '');
      if (actual !== expected) {
        throw new Error(`Read-after-write mismatch at col ${index + 1}`);
      }
    }
  }

  public async upsertSubmission(input: UpsertInput): Promise<UpsertResult> {
    const map = await this.ensureHeaderMap();
    const rowValues = this.buildRowValues(input.payload, input.contactKey, input.requestId, map);

    try {
      const existingRow = await this.findExistingRow(input.contactKey, map);
      let rowNumber = existingRow;
      let operation: 'insert' | 'update' = 'update';

      const maxColumnName = toColumnName(rowValues.length);
      if (rowNumber) {
        await withRetry(() =>
          this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `${PARTICIPANTS_SHEET}!A${rowNumber}:${maxColumnName}${rowNumber}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [rowValues]
            }
          })
        );
      } else {
        const appendResult = await withRetry(() =>
          this.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: `${PARTICIPANTS_SHEET}!A${DATA_START_ROW}:${maxColumnName}`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
              values: [rowValues]
            }
          })
        );

        const updatedRange = appendResult.data.updates?.updatedRange;
        const match = updatedRange?.match(/!(?:[A-Z]+)(\d+):/);
        rowNumber = match ? Number(match[1]) : null;
        operation = 'insert';
      }

      if (!rowNumber) {
        throw new Error('Unable to determine saved row number');
      }

      await this.verifyWrite(rowNumber, rowValues);

      await this.writeAuditLog({
        requestId: input.requestId,
        operation,
        rowNumber,
        status: 'ok',
        message: 'saved',
        contactKey: input.contactKey
      });

      return {
        operation,
        rowNumber,
        savedAt: new Date().toISOString()
      };
    } catch (error) {
      await this.writeAuditLog({
        requestId: input.requestId,
        operation: 'upsert',
        rowNumber: '',
        status: 'error',
        message: error instanceof Error ? error.message : 'unknown_error',
        contactKey: input.contactKey
      });
      throw error;
    }
  }
}

let singleton: GoogleSheetService | null = null;

export function getSheetService(): SheetService {
  if (!singleton) {
    singleton = new GoogleSheetService();
  }
  return singleton;
}
