import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
describe('Admin SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [SettingsComponent] }).compileComponents(); fixture = TestBed.createComponent(SettingsComponent); fixture.detectChanges(); });
  it('should create', () => { expect(fixture.componentInstance).toBeTruthy(); });
});
