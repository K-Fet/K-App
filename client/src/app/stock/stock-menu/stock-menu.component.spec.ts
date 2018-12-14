import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMenuComponent } from './stock-menu.component';
import {beforeEach, describe, expect, it} from "@angular/core/testing/src/testing_internal";

describe('StockMenuComponent', () => {
  let component: StockMenuComponent;
  let fixture: ComponentFixture<StockMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
