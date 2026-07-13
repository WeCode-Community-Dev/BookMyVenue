import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly totalItems = input(0);
  readonly pageSize = input(10);

  readonly pageChanged = output<number>();

  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  readonly hasPrevious = computed(() => this.currentPage() > 1);
  readonly hasNext = computed(() => this.currentPage() < this.totalPages());

  goToPage(page: number | '...'): void {
    if (page === '...') return;
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChanged.emit(page);
    }
  }

  previousPage(): void {
    if (this.hasPrevious()) {
      this.pageChanged.emit(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.pageChanged.emit(this.currentPage() + 1);
    }
  }
}
