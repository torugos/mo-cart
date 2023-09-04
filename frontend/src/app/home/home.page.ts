import { Component } from '@angular/core';
import { CartListPage } from '../cart-list/cart-list.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  component = CartListPage;

}
