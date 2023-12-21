import { TestBed } from '@angular/core/testing';

import { TarkovApiService } from './tarkov-api.service';

describe('TarkovapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TarkovApiService = TestBed.get(TarkovApiService);
    expect(service).toBeTruthy();
  });
});
