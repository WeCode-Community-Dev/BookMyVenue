import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { SpringPage } from '../../shared/models/api-response.model';
import { AdminUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminUserRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(page = 0, size = 10): Observable<SpringPage<AdminUser>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<SpringPage<AdminUser>>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.USERS}`, { params });
  }
}
