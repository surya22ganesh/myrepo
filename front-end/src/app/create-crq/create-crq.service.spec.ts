import { TestBed } from '@angular/core/testing';

import { CreateCrqService } from './create-crq.service';

describe('CreateCrqService', () => {
  let service: CreateCrqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCrqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
