import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartList } from 'src/app/models/cart-list.model';
import { Products } from 'src/app/models/products.model';

@Injectable({
  providedIn: 'root'
})
export class CartListService {
  
  private baseUrl: string = 'http://localhost:3001/cartList';

  constructor(public http: HttpClient) { }
  
  getListById(id: number) : Observable<CartList[]>{
    return this.http.get<CartList[]>(`${this.baseUrl}/?listId=${id}`)
  }

  // deleteById(productsArray: CartList) {
  //   return this.http.(`${this.baseUrl}/${id}`)
  // }

  // getListTeste(id: string){
  //   return this.http.get(this.baseUrl, id)
  // }

  updateCartList(listId: number, cartList: Products[]){
    let obj: CartList = {
      listId: listId,
      products: cartList
    }

    return this.http.post(`${this.baseUrl}/?listId=${listId}`, obj)
  }
}
