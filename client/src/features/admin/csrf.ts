let csrfToken: string | null = null;

export function setAdminCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getAdminCsrfToken() {
  return csrfToken;
}
