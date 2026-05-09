import { describe, expect, it } from 'vitest';
import { extractContactKey, intakeSchema } from '@/lib/form-schema';

describe('extractContactKey', () => {
  it('extracts email', () => {
    expect(extractContactKey('Анна anna@example.com')).toBe('anna@example.com');
  });

  it('extracts telegram username', () => {
    expect(extractContactKey('Илья @my_team_user')).toBe('@my_team_user');
  });
});

describe('intakeSchema', () => {
  it('validates minimal payload', () => {
    const parsed = intakeSchema.safeParse({
      name_contact: 'Иван @ivan',
      status: 'Активное ядро',
      goal: 'Хочу практику',
      skills: 'Пишу тексты',
      interests: 'Упаковка',
      dont_want: 'Без холодных звонков',
      hours_per_week: '3-5 часов',
      participation_mode: 'Отдельные задачи',
      roles_to_try: 'Копирайтинг',
      help_needed: 'Примеры брифов',
      constraints: 'Вечером',
      comment: '',
      questions: '',
      website: ''
    });

    expect(parsed.success).toBe(true);
  });
});
