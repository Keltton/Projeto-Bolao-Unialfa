import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = '@bolao:token';
export const USER_KEY = '@bolao:user';

const LEGACY_TOKEN_KEY = '@BolaoCopa:token';
const LEGACY_USER_KEY = '@BolaoCopa:usuario';

let sessionExpiredCallback: (() => void) | null = null;

export function registerSessionExpiredCallback(callback: () => void): void {
  sessionExpiredCallback = callback;
}

export async function getStoredToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) return token;

  const legacyToken = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);
  if (!legacyToken) return null;

  await AsyncStorage.setItem(TOKEN_KEY, legacyToken);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
  return legacyToken;
}

export async function getStoredUserJson(): Promise<string | null> {
  const userJson = await AsyncStorage.getItem(USER_KEY);
  if (userJson) return userJson;

  const legacyUserJson = await AsyncStorage.getItem(LEGACY_USER_KEY);
  if (!legacyUserJson) return null;

  await AsyncStorage.setItem(USER_KEY, legacyUserJson);
  await AsyncStorage.removeItem(LEGACY_USER_KEY);
  return legacyUserJson;
}

export async function invalidateSession(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, LEGACY_TOKEN_KEY, LEGACY_USER_KEY]);
  sessionExpiredCallback?.();
}
