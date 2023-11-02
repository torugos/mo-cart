import { TestBed } from '@angular/core/testing';

import { CartListService } from './cartList.service';

describe('CrudService', () => {
  let service: CartListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
