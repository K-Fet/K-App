import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseProductDialogComponent } from './choose-product-dialog.component';

describe('ChooseProductDialogComponent', () => {
  let component: ChooseProductDialogComponent;
  let fixture: ComponentFixture<ChooseProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseProductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
