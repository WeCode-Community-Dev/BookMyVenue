import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorsComponent } from './vendors.component';
describe('Admin VendorsComponent', () => {
  let fixture: ComponentFixture<VendorsComponent>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [VendorsComponent] }).compileComponents(); fixture = TestBed.createComponent(VendorsComponent); fixture.detectChanges(); });
  it('should create', () => { expect(fixture.componentInstance).toBeTruthy(); });
});
