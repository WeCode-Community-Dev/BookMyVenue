// Native provider singletons — the mobile equivalent of
// `src/infrastructure/providers.ts` on web. SAME ports, different adapters.
// To swap auth/storage providers (Cognito, R2, …) replace the factories
// here and nothing else changes.

import { makeHttpAuthProvider, makeHttpStorageProvider } from "@repo/infrastructure";
import type { AuthProvider, StorageProvider } from "@repo/contracts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
const API_URL = extra.API_URL ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const authProvider: AuthProvider = makeHttpAuthProvider({
  apiUrl: API_URL,
  storage: AsyncStorage,
});

export const storageProvider: StorageProvider = makeHttpStorageProvider({
  apiUrl: API_URL,
  getToken: () => AsyncStorage.getItem("better-auth.session_token"),
});
