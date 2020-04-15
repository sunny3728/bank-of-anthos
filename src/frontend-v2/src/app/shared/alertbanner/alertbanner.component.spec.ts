import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertbannerComponent } from './alertbanner.component';

describe('AlertbannerComponent', () => {
  let component: AlertbannerComponent;
  let fixture: ComponentFixture<AlertbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
