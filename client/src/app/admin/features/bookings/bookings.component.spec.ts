import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingsComponent } from './bookings.component';
describe('Admin BookingsComponent', () => {
  let fixture: ComponentFixture<BookingsComponent>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [BookingsComponent] }).compileComponents(); fixture = TestBed.createComponent(BookingsComponent); fixture.detectChanges(); });
  it('should create', () => { expect(fixture.componentInstance).toBeTruthy(); });
});
