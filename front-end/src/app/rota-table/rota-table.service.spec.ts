import { TestBed } from '@angular/core/testing';

import { RotaTableService } from './rota-table.service';

describe('RotaTableService', () => {
  let service: RotaTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RotaTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
