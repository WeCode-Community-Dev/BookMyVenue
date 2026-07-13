import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly overlay = input(false);
  readonly message = input('');

  readonly spinnerClass = computed(() => {
    const sizes: Record<string, string> = {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
    };
    return `${sizes[this.size()]} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`;
  });
}
