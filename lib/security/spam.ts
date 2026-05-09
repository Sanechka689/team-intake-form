const urlPattern = /(https?:\/\/|www\.)/gi;

export function isSpamLike(texts: string[]): boolean {
  const merged = texts.join(' ').toLowerCase();
  const links = merged.match(urlPattern);
  if (links && links.length > 3) {
    return true;
  }
  if (/\b(viagra|casino|crypto airdrop|earn money fast)\b/i.test(merged)) {
    return true;
  }
  if (/(.)\1{14,}/.test(merged)) {
    return true;
  }
  return false;
}
