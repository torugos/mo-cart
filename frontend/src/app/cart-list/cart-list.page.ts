import { Component, OnInit } from '@angular/core';
import { CartListService } from 'src/shared/services/cartList.service';
import { Products } from '../models/products.model';
import { AlertService } from 'src/shared/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SavedList } from '../models/saved-list.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.page.html',
  styleUrls: ['./cart-list.page.scss'],
})
export class CartListPage implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private alert: AlertService,
    private cartListService: CartListService) { }
  
  public lista: Products[] = [];
  public savedList: SavedList[] = [];
  public total: string = '';
  private idList: number = Number(this.route.snapshot.paramMap.get('id')); 

  //Add config
  public isAddModalOpen = false;
  public addPrice: number | null = null;
  public addProduct: string = '';
  
  //Edit config
  public isEditModalOpen = false;
  public editPrice: number | null = null;
  public editProductId: number | null = null;
  public editProduct: string = '';

  ngOnInit() {
    this.getAllList();
    this.getSavedList();
  }

  setEditOpen(isOpen: boolean){this.isEditModalOpen = isOpen;}
  setAddOpen(isOpen: boolean){
    this.isAddModalOpen = isOpen;
    this.addProduct = '';
    this.addPrice = null;

  }

  getSavedList() {
    this.cartListService.getSavedList().subscribe(
      (list) => {
        console.log(list)
        this.savedList = list;
      }
    )
  }

  itemAdd(teste: string){
    this.setAddOpen(true);
    this.addProduct = teste;
  }

  private getAllList() {
    this.cartListService.getListById(this.idList).subscribe(
      (response) => {
        console.log(response)
        this.lista = response.products;
        this.changeTotal();
      });
  }

  private changeTotal(){
    const prices = this.lista.map(obj => {return obj.price;});
    let soma = 0;
    prices.forEach(element => {soma += element});
    this.total = soma.toFixed(2)
  }

  public delete(id: number){
    let objIndex = this.lista.findIndex(obj => obj.productId == id)
    this.lista.splice(objIndex, 1)
    console.log(this.lista)
    this.cartListService.deleteCartProduct(this.idList, this.lista).subscribe(
      () => {
        this.getAllList();
        this.changeTotal();
      },
      (err) => {
        this.alert.errorPopUp("Erro ao excluir produto");
        console.log(err)
      }
    )
  }

  editModal(productId: number){
    this.setEditOpen(true);
    let objEdit = this.lista[this.lista.findIndex(obj => obj.productId === productId)];
    this.editProductId = productId;
    this.editProduct = objEdit.name;
    this.editPrice = objEdit.price;
  }

  saveEdit(){
    let obj = {
      name: this.editProduct,
      price: this.editPrice
    }

    Object.assign(this.lista[this.lista.findIndex(obj => obj.productId === this.editProductId)],obj)
    this.cartListService.updateCartList(this.idList,this.lista).subscribe(
      () => {
        this.setEditOpen(false);
        this.changeTotal();
      },
      (err) => {
        console.log(err)
      }
    )
  }

  saveAdd(){
    if(this.addPrice == null || this.addPrice == 0 || this.addProduct == null){
      return this.alert.errorPopUp("Preço/Nome do produto devem ser preenchidos");
    }

    const ids: number[] = this.lista.map(obj => {return obj.productId;});
    const max = Math.max(...ids)

    let obj: Products = {
      productId: max + 1,
      name: this.addProduct,
      price: this.addPrice
    }

    this.cartListService.insertCartList(this.idList, this.lista, obj).subscribe(
      () => {
        this.alert.successPopUp("Produto inserido com sucesso");
        this.getAllList();
        this.changeTotal();
        this.setAddOpen(false);
      },
      (err) => {
        this.alert.errorPopUp("Erro ao inserir produto");
        console.log(err)
      }
    )
  }
}
