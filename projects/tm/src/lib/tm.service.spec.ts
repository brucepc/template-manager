import { TestBed } from '@angular/core/testing';

import { TmService } from './tm.service';

describe('TmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TmService = TestBed.get(TmService);
    expect(service).toBeTruthy();
  });
});
