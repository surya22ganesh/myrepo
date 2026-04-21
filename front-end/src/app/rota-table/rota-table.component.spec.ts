import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaTableComponent } from './rota-table.component';

describe('RotaTableComponent', () => {
  let component: RotaTableComponent;
  let fixture: ComponentFixture<RotaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotaTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
