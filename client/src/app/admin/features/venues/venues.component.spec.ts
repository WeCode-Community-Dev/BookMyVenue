import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VenuesComponent } from './venues.component';
describe('Admin VenuesComponent', () => {
  let fixture: ComponentFixture<VenuesComponent>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [VenuesComponent] }).compileComponents(); fixture = TestBed.createComponent(VenuesComponent); fixture.detectChanges(); });
  it('should create', () => { expect(fixture.componentInstance).toBeTruthy(); });
});
