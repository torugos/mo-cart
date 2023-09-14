import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxCurrencyDirective } from "ngx-currency";

import { IonicModule } from '@ionic/angular';

import { CartListPageRoutingModule } from './cart-list-routing.module';

import { CartListPage } from './cart-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxCurrencyDirective,
    CartListPageRoutingModule
  ],
  declarations: [CartListPage]
})
export class CartListPageModule {}
