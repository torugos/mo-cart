import { Component, OnInit } from '@angular/core';
import { CartListService } from 'src/shared/services/cartList.service';
import { Products } from '../models/products.model';
import { CartList } from '../models/cart-list.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.page.html',
  styleUrls: ['./cart-list.page.scss'],
})
export class CartListPage implements OnInit {
  
  constructor(private cartListService: CartListService) { }
  
  public lista: Products[] = [];
  public total: string = '';

  //Add config
  public isAddModalOpen = false;
  public addPrice: number = 0;
  public addProduct: string = '';
  
  //Edit config
  public isEditModalOpen = false;
  public editPrice: number = 0;
  public editProductId: number = 0;
  public editProduct: string = '';

  ngOnInit() {
    this.getAllList();
  }

  setAddOpen(isOpen: boolean){this.isAddModalOpen = isOpen;}
  setEditOpen(isOpen: boolean){this.isEditModalOpen = isOpen;}

  private getAllList() {
    this.cartListService.getListById(1).subscribe(
      (response) => {
        this.lista = response[0].products;
        this.changeTotal();
      });
  }

  public delete(id: number){
    let objIndex = this.lista.findIndex(obj => obj.productId == id)
    this.lista.splice(objIndex, 1)
  }


  changeTotal(){
    const prices = this.lista.map(obj => {return obj.price;});
    let soma = 0;
    prices.forEach(element => {
      soma += element;
    });
    this.total = soma.toFixed(2)
  }

  editModal(productId: number){
    this.setEditOpen(true);
    let objEdit = this.lista[this.lista.findIndex(obj => obj.productId === productId)];
    this.editProductId = productId;
    this.editProduct = objEdit.name;
    this.editPrice = objEdit.price;
    console.log(this.lista)
  }

  saveEdit(){
    let obj = {
      name: this.editProduct,
      price: this.editPrice
    }

    Object.assign(this.lista[this.lista.findIndex(obj => obj.productId === this.editProductId)],obj)
    console.log(this.lista)
    this.cartListService.updateCartList(1,this.lista).subscribe(
      (response) => {
        console.log(response)
      }
    )
  }

  // save(){
  //   let obj: CartList = {
  //     id: 28,
  //     product: this.product,
  //     price: this.price
  //   }


  //   console.log(obj)
  // }
}
