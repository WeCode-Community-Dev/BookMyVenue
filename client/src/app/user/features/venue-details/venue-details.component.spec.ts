import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VenueDetailsComponent } from './venue-details.component';

describe('VenueDetailsComponent', () => {
  let component: VenueDetailsComponent;
  let fixture: ComponentFixture<VenueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueDetailsComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VenueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
