import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksManagementTableComponent } from './stocks-management-table.component';

describe('StocksManagementTableComponent', () => {
  let component: StocksManagementTableComponent;
  let fixture: ComponentFixture<StocksManagementTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksManagementTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
