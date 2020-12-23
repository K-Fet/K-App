import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTableComponent } from './stock-table.component';

describe('StockTableComponent', () => {
  let component: StockTableComponent;
  let fixture: ComponentFixture<StockTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
