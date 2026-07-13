import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { UserRepository } from '../repositories/user.repository';
import { User, UpdateUserRequest } from '../../shared/models/user.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userRepository = inject(UserRepository);
  private readonly notification = inject(NotificationService);

  readonly profile = signal<User | null>(null);

  loadProfile(): Observable<User> {
    return this.userRepository.getProfile().pipe(
      map((response) => response.data),
      tap((user) => this.profile.set(user))
    );
  }

  updateProfile(payload: UpdateUserRequest): Observable<User> {
    return this.userRepository.updateProfile(payload).pipe(
      map((response) => response.data),
      tap((user) => {
        this.profile.set(user);
        this.notification.success('Profile updated successfully');
      })
    );
  }
}
