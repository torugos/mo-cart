import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartList } from 'src/app/models/cart-list.model';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  
  private baseUrl: string = 'http://localhost:3001/buyList';

  constructor(public http: HttpClient) { }
  
  getFromBuyList() : Observable<CartList[]>{
    return this.http.get<CartList[]>(this.baseUrl)
  }

  deleteById(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`)
  }


}
