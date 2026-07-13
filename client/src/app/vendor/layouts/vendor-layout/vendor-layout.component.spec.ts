import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VendorLayoutComponent } from './vendor-layout.component';

describe('VendorLayoutComponent', () => {
  let component: VendorLayoutComponent;
  let fixture: ComponentFixture<VendorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorLayoutComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
