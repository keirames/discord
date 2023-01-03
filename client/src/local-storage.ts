const tokenKey = 'token';

export const setToken = (token: string) => {
  localStorage.setItem(tokenKey, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(tokenKey);
};
