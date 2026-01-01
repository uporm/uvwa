const TOKEN_KEY = 'NS-TOKEN';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(accessToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
}

export function clear() {
  localStorage.clear();
}