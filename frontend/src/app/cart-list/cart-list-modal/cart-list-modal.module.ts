import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartListModalPageRoutingModule } from './cart-list-modal-routing.module';

import { CartListModalPage } from './cart-list-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartListModalPageRoutingModule
  ],
  declarations: [CartListModalPage]
})
export class CartListModalPageModule {}
