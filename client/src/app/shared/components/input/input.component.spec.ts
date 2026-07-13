import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label when provided', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Email');
  });

  it('should show error message', () => {
    fixture.componentRef.setInput('error', 'Required field');
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('p');
    expect(error.textContent).toContain('Required field');
  });
});
