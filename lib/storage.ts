/**
 * Safely access localStorage with type checking
 * Falls back to default value if localStorage is not available (during SSR)
 * or if the key doesn't exist
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    
    // Handle different types appropriately
    if (typeof defaultValue === 'boolean') {
      return (item === 'true') as unknown as T;
    }
    
    if (typeof defaultValue === 'number') {
      return Number(item) as unknown as T;
    }
    
    if (typeof defaultValue === 'object') {
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        console.error(`Error parsing JSON from localStorage for key ${key}:`, e);
        return defaultValue;
      }
    }
    
    return item as unknown as T;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return defaultValue;
  }
}

/**
 * Safely set localStorage with type checking
 * No-op if localStorage is not available (during SSR)
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
} 