import { Component, input, output, ChangeDetectionStrategy, TemplateRef, contentChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = Record<string, unknown>> {
  readonly columns = input.required<TableColumn[]>();
  readonly data = input.required<T[]>();
  readonly loading = input(false);
  readonly striped = input(true);

  readonly rowClicked = output<T>();
  readonly sortChanged = output<{ key: string; direction: 'asc' | 'desc' }>();

  readonly rowTemplate = contentChild<TemplateRef<unknown>>('rowTemplate');

  private sortKey = '';
  private sortDirection: 'asc' | 'desc' = 'asc';

  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }
    this.sortChanged.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  onRowClick(item: T): void {
    this.rowClicked.emit(item);
  }

  getCellValue(item: T, key: string): unknown {
    return (item as Record<string, unknown>)[key];
  }
}
