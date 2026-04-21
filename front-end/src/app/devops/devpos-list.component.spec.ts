import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevopsListComponent } from './devpos-list.component';

describe('EmployeeListComponent', () => {
  let component: DevopsListComponent;
  let fixture: ComponentFixture<DevopsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevopsListComponent]
    });
    fixture = TestBed.createComponent(DevopsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
