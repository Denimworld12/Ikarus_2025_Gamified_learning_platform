/**
 * Safe browser utilities for Next.js
 * Prevents SSR errors by checking for browser environment
 */

// Check if code is running in browser
export const isBrowser = typeof window !== 'undefined'

/**
 * Safely get data from localStorage with fallback
 */
export function getLocalStorage(key: string, defaultValue: any = null) {
  if (!isBrowser) return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item || defaultValue
  } catch (e) {
    console.error('Error accessing localStorage', e)
    return defaultValue
  }
}

/**
 * Safely set data in localStorage
 */
export function setLocalStorage(key: string, value: any) {
  if (!isBrowser) return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    console.error('Error setting localStorage', e)
    return false
  }
}

/**
 * Safely remove data from localStorage
 */
export function removeLocalStorage(key: string) {
  if (!isBrowser) return false
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error('Error removing item from localStorage', e)
    return false
  }
} 