import { z } from 'zod';

const MAX_TEXT = 2000;

export const intakeSchema = z.object({
  name_contact: z.string().min(5, 'Укажите имя и Telegram/Email').max(300),
  status: z.string().min(2, 'Выберите статус участия').max(120),
  goal: z.string().min(3, 'Опишите, что хотите получить от проекта').max(MAX_TEXT),
  skills: z.string().min(3, 'Опишите ваши навыки').max(MAX_TEXT),
  interests: z.string().min(3, 'Опишите интересные направления').max(MAX_TEXT),
  dont_want: z.string().min(2, 'Укажите, что вы не хотите делать').max(MAX_TEXT),
  hours_per_week: z.string().min(1, 'Укажите время в неделю').max(100),
  participation_mode: z.string().min(2, 'Укажите формат участия').max(120),
  roles_to_try: z.string().min(2, 'Укажите роли или задачи').max(MAX_TEXT),
  help_needed: z.string().min(2, 'Укажите, где нужна поддержка').max(MAX_TEXT),
  constraints: z.string().min(2, 'Укажите ограничения').max(MAX_TEXT),
  comment: z.string().max(MAX_TEXT).optional().default(''),
  questions: z.string().max(MAX_TEXT).optional().default(''),
  website: z.string().max(0).optional().default('')
});

export type IntakeFormData = z.infer<typeof intakeSchema>;

export const dtoFieldKeys = [
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
  'constraints',
  'comment',
  'questions'
] as const;

export function extractContactKey(nameContact: string): string {
  const value = nameContact.toLowerCase().trim();
  const emailMatch = value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (emailMatch) {
    return emailMatch[0];
  }
  const telegramMatch = value.match(/@[a-z0-9_]{4,}/i);
  if (telegramMatch) {
    return telegramMatch[0];
  }
  const phoneMatch = value.replace(/[^+\d]/g, '');
  if (phoneMatch.length >= 10) {
    return phoneMatch;
  }
  return value.replace(/\s+/g, ' ');
}
