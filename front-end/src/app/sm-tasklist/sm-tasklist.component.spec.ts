import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SMTaskListComponent } from './sm-tasklist.component';



describe('EmployeeListComponent', () => {
  let component: SMTaskListComponent;
  let fixture: ComponentFixture<SMTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SMTaskListComponent]
    });
    fixture = TestBed.createComponent(SMTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
