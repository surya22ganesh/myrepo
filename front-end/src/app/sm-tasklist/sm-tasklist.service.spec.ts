import { TestBed } from '@angular/core/testing';

import { SmTasklistService } from './sm-tasklist.service';

describe('SmTasklistService', () => {
  let service: SmTasklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmTasklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
