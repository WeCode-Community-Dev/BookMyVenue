import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminUserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-users', standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, PaginationComponent,DatePipe],
  templateUrl: './users.component.html', styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  readonly userService = inject(AdminUserService);

  ngOnInit(): void { this.userService.loadUsers(); }

  onPageChange(page: number): void { this.userService.loadUsers(page - 1); }
}
