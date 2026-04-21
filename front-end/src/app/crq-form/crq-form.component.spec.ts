import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrqFormComponent } from './crq-form.component';

describe('CrqFormComponent', () => {
  let component: CrqFormComponent;
  let fixture: ComponentFixture<CrqFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrqFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
