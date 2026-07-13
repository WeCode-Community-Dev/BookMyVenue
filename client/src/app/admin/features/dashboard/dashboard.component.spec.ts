import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
describe('Admin DashboardComponent', () => {
  let component: DashboardComponent; let fixture: ComponentFixture<DashboardComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DashboardComponent], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  it('should create', () => { expect(component).toBeTruthy(); });
});
