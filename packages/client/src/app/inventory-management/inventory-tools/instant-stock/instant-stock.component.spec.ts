import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantStockComponent } from './instant-stock.component';

describe('InstantStockComponent', () => {
  let component: InstantStockComponent;
  let fixture: ComponentFixture<InstantStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
