import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './login.component';
describe('Admin LoginComponent', () => {
  let component: LoginComponent; let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoginComponent], providers: [provideRouter([]), provideHttpClient()] }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  it('should create', () => { expect(component).toBeTruthy(); });
});
