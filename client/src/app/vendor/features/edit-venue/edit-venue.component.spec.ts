import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { EditVenueComponent } from './edit-venue.component';
describe('EditVenueComponent', () => {
  let component: EditVenueComponent; let fixture: ComponentFixture<EditVenueComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EditVenueComponent], providers: [provideRouter([]), provideHttpClient()] }).compileComponents();
    fixture = TestBed.createComponent(EditVenueComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  it('should create', () => { expect(component).toBeTruthy(); });
});
