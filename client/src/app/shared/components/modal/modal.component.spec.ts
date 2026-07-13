import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when closed', () => {
    const overlay = fixture.nativeElement.querySelector('.fixed');
    expect(overlay).toBeNull();
  });

  it('should render when open', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Test Modal');
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Test Modal');
  });
});
