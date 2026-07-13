import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsComponent } from './analytics.component';
describe('Admin AnalyticsComponent', () => {
  let fixture: ComponentFixture<AnalyticsComponent>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [AnalyticsComponent] }).compileComponents(); fixture = TestBed.createComponent(AnalyticsComponent); fixture.detectChanges(); });
  it('should create', () => { expect(fixture.componentInstance).toBeTruthy(); });
});
