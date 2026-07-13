import { Directive, ElementRef, inject, output } from '@angular/core';
import { fromEvent, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({ selector: '[appClickOutside]', standalone: true })
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef);
  readonly appClickOutside = output<void>();

  constructor() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => !this.elementRef.nativeElement.contains(event.target as Node)),
        takeUntilDestroyed()
      )
      .subscribe(() => this.appClickOutside.emit());
  }
}
