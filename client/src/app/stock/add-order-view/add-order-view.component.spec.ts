import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderViewComponent } from './add-order-view.component';

describe('AddOrderViewComponent', () => {
  let component: AddOrderViewComponent;
  let fixture: ComponentFixture<AddOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
