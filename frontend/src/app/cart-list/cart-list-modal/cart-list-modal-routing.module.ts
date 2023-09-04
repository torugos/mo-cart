import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartListModalPage } from './cart-list-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CartListModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartListModalPageRoutingModule {}
