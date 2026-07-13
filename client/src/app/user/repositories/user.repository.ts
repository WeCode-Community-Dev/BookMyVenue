import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../../shared/constants/api-endpoints.constant';
import { User, UpdateUserRequest } from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.apiUrl}${API_ENDPOINTS.USERS.PROFILE}`
    );
  }

  updateProfile(payload: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(
      `${this.apiUrl}${API_ENDPOINTS.USERS.PROFILE}`,
      payload
    );
  }
}
