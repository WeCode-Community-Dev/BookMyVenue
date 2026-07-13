import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly cookieOptions = ';path=/;SameSite=Lax';

  get(key: string): string | null {
    // Try cookie first, then localStorage
    const cookieValue = this.getCookie(key);
    if (cookieValue) return cookieValue;
    return localStorage.getItem(key);
  }

  set(key: string, value: string, useCookie = false): void {
    if (useCookie) {
      this.setCookie(key, value);
    }
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    this.deleteCookie(key);
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private setCookie(name: string, value: string): void {
    document.cookie = `${name}=${encodeURIComponent(value)}${this.cookieOptions}`;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC${this.cookieOptions}`;
  }
}
