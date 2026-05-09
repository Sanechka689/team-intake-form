export type AppLinks = {
  folder: string;
  cheatsheet: string;
  table: string;
  instruction: string;
  askQuestion: string;
};

function normalizeLink(value: string | undefined, fallback: string): string {
  const clean = String(value ?? '').trim();
  if (!clean || clean === '#') {
    return fallback;
  }
  return clean;
}

export function getAppLinks(): AppLinks {
  return {
    folder: normalizeLink(process.env.LINK_FOLDER, '/instruction#materials'),
    cheatsheet: normalizeLink(process.env.LINK_CHEATSHEET, '/instruction#cheatsheet'),
    table: normalizeLink(process.env.LINK_TABLE, '/instruction#table'),
    instruction: '/instruction',
    askQuestion: normalizeLink(process.env.LINK_QUESTIONS, '/instruction#contacts')
  };
}
