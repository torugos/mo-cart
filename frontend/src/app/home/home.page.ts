import { Component, Input, OnInit } from '@angular/core';
import { CartListService } from 'src/shared/services/cartList.service';
import { CartList } from '../models/cart-list.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

  public lista : CartList[] = []

  constructor(private cartListService: CartListService){}

  ngOnInit(): void {
    this.cartListService.getAllLists().subscribe(
      (response) => {
        console.log(response)
        this.lista = response
      }
    )
  }

}
