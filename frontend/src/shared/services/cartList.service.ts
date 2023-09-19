import { HttpClient, HttpResponse } from '@angular/common/http';
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
  
  getListById(id: number) : Observable<CartList>{
    return this.http.get<CartList>(`${this.baseUrl}/${id}`)
  }

  getAllLists() : Observable<CartList[]>{
    return this.http.get<CartList[]>(this.baseUrl)
  }

  updateCartList(listId: number, cartList: Products[]): Observable<HttpResponse<boolean>>{
    let obj = {
      products: cartList
    }
    return this.http.put<HttpResponse<boolean>>(`${this.baseUrl}/${listId}`, obj)
  }

  insertCartList(listId: number, cartList: Products[], product: Products): Observable<HttpResponse<boolean>>{
    const newProduct = [...cartList, product] 

    let obj = {
      products: newProduct
    }
    return this.http.put<HttpResponse<boolean>>(`${this.baseUrl}/${listId}`, obj)
  }

  deleteCartProduct(listId: number, cartList: Products[]): Observable<HttpResponse<boolean>>{
    let obj = {
      products: cartList
    }
    return this.http.put<HttpResponse<boolean>>(`${this.baseUrl}/${listId}`, obj)
  }
}
