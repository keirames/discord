// Use to fake query from server
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
