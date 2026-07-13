import { Provider } from '@angular/core';
import { environment } from '../config/environment';
import { API_URL, TOKEN_KEY, REFRESH_TOKEN_KEY } from '../tokens/injection-tokens';

export const appProviders: Provider[] = [
  { provide: API_URL, useValue: environment.apiUrl },
  { provide: TOKEN_KEY, useValue: environment.tokenKey },
  { provide: REFRESH_TOKEN_KEY, useValue: environment.refreshTokenKey },
];
