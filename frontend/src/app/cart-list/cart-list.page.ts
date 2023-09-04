import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/shared/services/crud.service';
import { CartList } from '../models/cart-list.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.page.html',
  styleUrls: ['./cart-list.page.scss'],
})
export class CartListPage implements OnInit {

  constructor(private crudService: CrudService) { }

  public lista: CartList[] = [];

  ngOnInit() {
    this.getAllList();
  }

  private getAllList() {
    this.crudService.getFromBuyList().subscribe(
      (response) => {
        this.lista = response;
        console.log(this.lista);
      });
  }

  public delete(id: number){
    this.crudService.deleteById(id).subscribe(
      (response) => {
        console.log(response)
        this.getAllList();
      }
    )
  }
}
