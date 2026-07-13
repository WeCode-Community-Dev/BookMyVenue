import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent, TableColumn } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('data', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no data message when empty', () => {
    const cell = fixture.nativeElement.querySelector('td');
    expect(cell.textContent).toContain('No data available');
  });
});
