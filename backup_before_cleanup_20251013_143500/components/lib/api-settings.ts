/**
 * ניהול הגדרות API גלובליות
 */

const API_KEY_STORAGE = 'legal_ai_api_key';

/**
 * שמירת API Key ב-localStorage
 */
export function saveAPIKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(API_KEY_STORAGE, apiKey);
    } catch (e) {
      console.error('Failed to save API key:', e);
    }
  }
}

/**
 * טעינת API Key מ-localStorage
 */
export function loadAPIKey(): string {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(API_KEY_STORAGE) || '';
    } catch (e) {
      console.error('Failed to load API key:', e);
    }
  }
  return '';
}

/**
 * מחיקת API Key
 */
export function clearAPIKey(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(API_KEY_STORAGE);
    } catch (e) {
      console.error('Failed to clear API key:', e);
    }
  }
}

/**
 * בדיקה אם יש API Key שמור
 */
export function hasAPIKey(): boolean {
  const key = loadAPIKey();
  return key.length > 0 && key.startsWith('sk-ant-');
}

