import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BookingsComponent } from './bookings.component';
describe('Vendor BookingsComponent', () => {
  let component: BookingsComponent; let fixture: ComponentFixture<BookingsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BookingsComponent], providers: [provideHttpClient()] }).compileComponents();
    fixture = TestBed.createComponent(BookingsComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  it('should create', () => { expect(component).toBeTruthy(); });
});
