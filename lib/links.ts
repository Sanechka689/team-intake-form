export type ProjectLinks = {
  folder: string;
  cheatsheet: string;
  table: string;
  instruction: string;
  askQuestion: string;
};

const defaults: ProjectLinks = {
  folder: 'https://drive.google.com/drive/folders/1dg3wiWS_9hcCx7RFwE3TymestF43kXyM',
  cheatsheet: 'https://docs.google.com/document/d/1mQUKdF0pUtTDUuusGONeyC8ncRV8EwxU/edit',
  table: 'https://docs.google.com/spreadsheets/d/1mJMulDCnOJz5qPUvGvw5lpV-lw_42UiwiuzjnK2jSgA/edit',
  instruction: 'https://docs.google.com/document/d/1mjxkKwodIbdujEkZ0eM25hTjBtmOW03T/edit',
  askQuestion: 'https://docs.google.com/document/d/1mjxkKwodIbdujEkZ0eM25hTjBtmOW03T/edit'
};

function normalizeUrl(value: string | undefined, fallback: string): string {
  const raw = String(value ?? '').trim();
  if (!raw || raw === '#' || raw.toUpperCase().startsWith('PASTE_') || raw.toUpperCase().startsWith('REPLACE_')) {
    return fallback;
  }

  if (raw.startsWith('/')) {
    return raw;
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }

  return fallback;
}

export function getProjectLinks(): ProjectLinks {
  return {
    folder: normalizeUrl(process.env.LINK_FOLDER, defaults.folder),
    cheatsheet: normalizeUrl(process.env.LINK_CHEATSHEET, defaults.cheatsheet),
    table: normalizeUrl(process.env.LINK_TABLE, defaults.table),
    instruction: normalizeUrl(process.env.LINK_INSTRUCTION, defaults.instruction),
    askQuestion: normalizeUrl(process.env.LINK_ASK_QUESTION ?? process.env.LINK_QUESTIONS, defaults.askQuestion)
  };
}
