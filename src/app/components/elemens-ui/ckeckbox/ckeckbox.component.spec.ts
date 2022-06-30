import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeckboxComponent } from './ckeckbox.component';

describe('CkeckboxComponent', () => {
  let component: CkeckboxComponent;
  let fixture: ComponentFixture<CkeckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CkeckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CkeckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
