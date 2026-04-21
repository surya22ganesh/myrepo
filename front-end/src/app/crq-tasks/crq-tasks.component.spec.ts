import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrqTasksComponent } from './crq-tasks.component';

describe('CrqTasksComponent', () => {
  let component: CrqTasksComponent;
  let fixture: ComponentFixture<CrqTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrqTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrqTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
