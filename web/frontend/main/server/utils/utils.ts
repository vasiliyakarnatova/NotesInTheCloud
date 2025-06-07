export const USER_TOKEN = "myToken";

export function getCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split('; ');
  for (let cookie of cookies) {
    const [cookieName, ...cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue.join('='));
    }
  }
  return null;
}

export function getRemoveCookieHeader(name: string, path = '/'): string {
  return `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}
