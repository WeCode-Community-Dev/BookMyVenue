import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AdminVendorService } from '../../services/vendor.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-vendors', standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, PaginationComponent,DatePipe],
  templateUrl: './vendors.component.html', styleUrl: './vendors.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorsComponent implements OnInit {
  readonly vendorService = inject(AdminVendorService);

  ngOnInit(): void { this.vendorService.loadVendors(); }

  onPageChange(page: number): void { this.vendorService.loadVendors(page - 1); }
}
