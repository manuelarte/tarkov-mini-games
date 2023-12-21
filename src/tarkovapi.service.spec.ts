import { TestBed } from '@angular/core/testing';

import { TarkovapiService } from './tarkovapi.service';

describe('TarkovapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TarkovapiService = TestBed.get(TarkovapiService);
    expect(service).toBeTruthy();
  });
});
