import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartList } from 'src/app/models/cart-list.model';
import { Products } from 'src/app/models/products.model';
import { SavedList } from 'src/app/models/saved-list.model';

@Injectable({
  providedIn: 'root'
})
export class CartListService {
  
  private baseUrl: string = 'http://localhost:3001';

  constructor(public http: HttpClient) { }
  
  getListById(id: number) : Observable<CartList>{
    return this.http.get<CartList>(`${this.baseUrl}/cartList/${id}`)
  }

  getAllLists() : Observable<CartList[]>{
    return this.http.get<CartList[]>(`${this.baseUrl}/cartList`)
  }

  updateCartList(listId: number, cartList: Products[]): Observable<HttpResponse<boolean>>{
    let obj = {
      products: cartList
    }
    return this.http.patch<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  insertCartList(listId: number, cartList: Products[], product: Products): Observable<HttpResponse<boolean>>{
    const newProduct = [...cartList, product] 

    let obj = {
      products: newProduct
    }
    return this.http.put<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  deleteCartProduct(listId: number, cartList: Products[]): Observable<HttpResponse<boolean>>{
    let obj = {
      products: cartList
    }
    return this.http.put<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  createNewList(listName: string): Observable<HttpResponse<boolean>>{
    let obj = {
      listName: listName,
      dateTime: new Date(),
      products: []
    }

    return this.http.post<HttpResponse<boolean>>(`${this.baseUrl}/cartList`, obj)
  }

  deleteList(id: number): Observable<HttpResponse<boolean>>{
    return this.http.delete<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${id}`)
  }

  getSavedList(): Observable<SavedList[]>{
    return this.http.get<SavedList[]>(`${this.baseUrl}/savedList`)
  }

}
