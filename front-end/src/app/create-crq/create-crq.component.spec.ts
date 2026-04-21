import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCrqComponent } from './create-crq-new.component';

describe('CreateCrqComponent', () => {
  let component: CreateCrqComponent;
  let fixture: ComponentFixture<CreateCrqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCrqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCrqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
