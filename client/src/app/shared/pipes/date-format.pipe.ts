import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, format: 'short' | 'long' | 'date' | 'time' = 'short'): string {
    if (!value) return '';
    const date = new Date(value);

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      case 'long':
        return date.toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        });
      case 'date':
        return date.toLocaleDateString('en-US');
      case 'time':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      default:
        return date.toLocaleDateString('en-US');
    }
  }
}
