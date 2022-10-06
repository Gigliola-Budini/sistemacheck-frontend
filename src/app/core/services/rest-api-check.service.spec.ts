import { TestBed } from '@angular/core/testing';

import { RestApiCheckService } from './rest-api-check.service';

describe('RestApiCheckService', () => {
  let service: RestApiCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestApiCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
