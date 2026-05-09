export function getAccessSecret(): string {
  return String(process.env.APP_SECRET ?? '').trim();
}

export function isAccessConfigured(): boolean {
  return getAccessSecret().length > 0;
}

export function isAccessTokenValid(token: string | null | undefined): boolean {
  const secret = getAccessSecret();
  if (!secret) {
    return false;
  }
  return String(token ?? '').trim() === secret;
}
