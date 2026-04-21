import { TestBed } from '@angular/core/testing';

import { TaskdetailsService } from './taskdetails.service';

describe('TaskdetailsService', () => {
  let service: TaskdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
