import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VenueListComponent } from './venue-list.component';

describe('VenueListComponent', () => {
  let component: VenueListComponent;
  let fixture: ComponentFixture<VenueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueListComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VenueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
