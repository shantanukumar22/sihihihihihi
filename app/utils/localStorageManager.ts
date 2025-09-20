// localStorage utilities with expiry support

export function setWithExpiry(key: string, value: string, hours: number): void {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + (hours * 60 * 60 * 1000)
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string): string | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
