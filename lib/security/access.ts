export function isAccessTokenValid(token: string | null | undefined): boolean {
  const secret = process.env.APP_SECRET;
  if (!secret) {
    return false;
  }
  return token === secret;
}
