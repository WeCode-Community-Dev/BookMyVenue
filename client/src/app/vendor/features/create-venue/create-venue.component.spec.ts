import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CreateVenueComponent } from './create-venue.component';
describe('CreateVenueComponent', () => {
  let component: CreateVenueComponent;
  let fixture: ComponentFixture<CreateVenueComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CreateVenueComponent], providers: [provideRouter([]), provideHttpClient()] }).compileComponents();
    fixture = TestBed.createComponent(CreateVenueComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  it('should create', () => { expect(component).toBeTruthy(); });
});
