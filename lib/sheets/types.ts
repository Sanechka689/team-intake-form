import type { IntakeFormData } from '@/lib/form-schema';

export type UpsertInput = {
  payload: IntakeFormData;
  requestId: string;
  contactKey: string;
};

export type UpsertResult = {
  operation: 'insert' | 'update';
  rowNumber: number;
  savedAt: string;
};

export interface SheetService {
  upsertSubmission(input: UpsertInput): Promise<UpsertResult>;
}
