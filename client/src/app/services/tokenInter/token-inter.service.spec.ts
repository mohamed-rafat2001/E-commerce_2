import { TestBed } from '@angular/core/testing';

import { TokenInterService } from './token-inter.service';

describe('TokenInterService', () => {
  let service: TokenInterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenInterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
