import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartListModalPage } from './cart-list-modal.page';

describe('CartListModalPage', () => {
  let component: CartListModalPage;
  let fixture: ComponentFixture<CartListModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartListModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
