import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartListPage } from './cart-list.page';

const routes: Routes = [
  {
    path: '',
    component: CartListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartListPageRoutingModule {}
