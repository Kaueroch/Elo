function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
}

/** Extrai o ID (UUID) do usuário a partir do claim "sub" do token JWT */
export function getUserIdFromToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const payload = decodeJwt(token);
  const sub = payload?.sub;
  if (typeof sub !== 'string' || !sub) return null;
  return sub;
}

export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  const exp = payload.exp;
  if (typeof exp !== 'number') return false;
  return exp * 1000 > Date.now();
}
