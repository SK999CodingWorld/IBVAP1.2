const TOKEN_KEY = 'ibvap_token';

/** Browser storage can be unavailable in private or restricted contexts. */
export function readSessionToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeSessionToken(token: string): boolean {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch {
    return false;
  }
}

export function clearSessionToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // The caller still clears the in-memory session.
  }
}
