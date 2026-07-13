import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input('No data found');
  readonly message = input('There are no items to display at the moment.');
  readonly icon = input<'search' | 'inbox' | 'calendar' | 'users'>('inbox');
  readonly actionLabel = input('');

  readonly actionClicked = output<void>();

  onAction(): void {
    this.actionClicked.emit();
  }
}
