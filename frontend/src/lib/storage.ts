export const storage = {
  get: (key: string) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
  set: (key: string, val: string) => typeof window !== 'undefined' && localStorage.setItem(key, val),
  remove: (key: string) => typeof window !== 'undefined' && localStorage.removeItem(key),
};