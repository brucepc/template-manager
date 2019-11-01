import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmPrintComponent } from './tm-print.component';

describe('TmPrintComponent', () => {
  let component: TmPrintComponent;
  let fixture: ComponentFixture<TmPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
