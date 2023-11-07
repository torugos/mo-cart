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

  updateTotal(total: number, listId: number): Observable<HttpResponse<boolean>>{
    let obj = {
      total: total
    }
    return this.http.patch<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  insertCartList(listId: number, cartList: Products[]): Observable<HttpResponse<boolean>>{
    let obj = {
      products: cartList
    }
    return this.http.patch<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  deleteCartProduct(listId: number, cartList: Products[], total: number): Observable<HttpResponse<boolean>>{
    let obj = {
      products: cartList,
      total: total
    }
    return this.http.patch<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  createNewList(listName: string): Observable<HttpResponse<boolean>>{
    let obj = {
      listName: listName,
      dateTime: new Date(),
      products: []
    }

    return this.http.post<HttpResponse<boolean>>(`${this.baseUrl}/cartList`, obj)
  }
  AlterNewListName(listId:number, listName: string): Observable<HttpResponse<boolean>>{
    let obj ={
      listName: listName
    }
    return this.http.patch<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${listId}`, obj)
  }

  deleteCartList(id: number): Observable<HttpResponse<boolean>>{
    return this.http.delete<HttpResponse<boolean>>(`${this.baseUrl}/cartList/${id}`)
  }

  getSavedList(): Observable<SavedList[]>{
    return this.http.get<SavedList[]>(`${this.baseUrl}/savedList`)
  }

  insertSavedList(element: string, quantidade: number, un: string): Observable<HttpResponse<boolean>>{
    let obj = {
      name: element,
      qtd: quantidade,
      unidade: un,
      selected: false
    }

    return this.http.post<HttpResponse<boolean>>(`${this.baseUrl}/savedList`, obj);
  }

  deleteSavedList(index: number): Observable<HttpResponse<boolean>>{
    return this.http.delete<HttpResponse<boolean>>(`${this.baseUrl}/savedList/${index}`);
  }

  UpdateSavedListItem(id:number, itemName: string, quantidade: number, un: string): Observable<HttpResponse<boolean>>{
    let obj ={
      name: itemName,
      qtd: quantidade,
      unidade: un
    }
    return this.http.patch<HttpResponse<boolean>>(`${this.baseUrl}/savedList/${id}`, obj)
  }
}
