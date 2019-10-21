import { TestBed } from '@angular/core/testing';

import { GapService } from './gap.service';

describe('GapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GapService = TestBed.get(GapService);
    expect(service).toBeTruthy();
  });
});
