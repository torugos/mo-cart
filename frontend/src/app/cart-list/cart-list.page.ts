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
  public qtdItens: number = 0;
  private idList: number = Number(this.route.snapshot.paramMap.get('id')); 
  
  //Add config
  public isAddModalOpen = false;
  public addProduct: string | null = null;
  public addPrice: number | null = null;
  public addQtd: number | null = null;
  public addUn: string | null = null;
  
  //Edit config
  public isEditModalOpen = false;
  public editProductId: number | null = null;
  public editProduct: string | null = null;
  public editPrice: number | null = null;
  public editQtd: number | null = null;
  public editUn: string| null = null;

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

  plusOne(productId: number, qtt: number){
    let obj ={
      qtd: qtt + 1
    }

    Object.assign(this.lista[this.lista.findIndex(obj => obj.productId === productId)],obj)
    this.cartListService.updateCartList(this.idList,this.lista).subscribe(
      () => {
        this.refreshTotal();
        this.refreshQtdItens();
      },
      (err) => {
        console.log(err)
      }
    )
  }
  
  minusOne(productId : number, qtd: number){
    if(qtd === 1){
      this.alert.errorPopUp("Não é possivel diminuir a quantia para zero, delete o item!")
      return
    } else {
      let obj ={
        qtd: qtd + -1
      }
      Object.assign(this.lista[this.lista.findIndex(obj => obj.productId === productId)],obj)
      this.cartListService.updateCartList(this.idList,this.lista).subscribe(
        () => {
          this.refreshTotal();
          this.refreshQtdItens();
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }

  getSavedList() {
    this.cartListService.getSavedList().subscribe(
      (list) => {
        this.savedList = list;
      }
    )
  }

  itemAdd(itemName: string){
    this.setAddOpen(true);
    this.addProduct = itemName;
  }

  private getAllList() {
    this.cartListService.getListById(this.idList).subscribe(
      (response) => {
        this.lista = response.products;
        this.refreshTotal();
        this.refreshQtdItens();
      });
  }

  private refreshQtdItens() {
    this.qtdItens = 0;
    this.lista.forEach(
      (element) => {
        if(element.unidade == 'un')
          this.qtdItens += element.qtd;
        else
          this.qtdItens++;
      }
    )
  }

  private refreshTotal(){
    const prices = this.lista.map(obj => {return obj.price * obj.qtd;});  
    
    let soma = 0;
    prices.forEach(element => {soma += element});
  
    this.total = soma.toFixed(2)
  }

  public delete(id: number){
    this.alert.confirmDelete()
      .then((result) => {
        if(result.isConfirmed){
          let objIndex = this.lista.findIndex(obj => obj.productId == id)
          this.lista.splice(objIndex, 1)
          this.cartListService.deleteCartProduct(this.idList, this.lista).subscribe(
            () => {
              this.getAllList();
              this.refreshTotal();
            },
            (err) => {
              this.alert.errorPopUp("Erro ao excluir produto");
              console.log(err)
            }
          )
        }
      })
  }

  editModal(productId: number){
    this.setEditOpen(true);
    let objEdit = this.lista[this.lista.findIndex(obj => obj.productId === productId)];
    this.editProductId = productId;
    this.editProduct = objEdit.name;
    this.editPrice = objEdit.price;
    this.editQtd = objEdit.qtd;
    this.editUn = objEdit.unidade;
  }

  saveEdit(){
    if((this.editPrice == null || this.editPrice == 0) || this.editProduct == null || (this.editQtd == 0 || this.editQtd == null) || this.editUn == null){
      return this.alert.errorPopUp("Todos os campos devem ser preenchidos");
    }

    if(this.editUn == 'gr')
    this.editPrice = this.editPrice / this.editQtd

    let obj = {
      name: this.editProduct,
      price: this.editPrice,
      qtd: this.editQtd,
      unidade: this.editUn
    };

    console.log(obj)
    Object.assign(this.lista[this.lista.findIndex(obj => obj.productId === this.editProductId)],obj)

    console.log(this.lista)
    this.cartListService.updateCartList(this.idList,this.lista).subscribe(
      () => {
        this.setEditOpen(false);
        this.refreshTotal();
      },
      (err) => {
        console.log(err)
      }
    )
  }
  
  saveAdd(){
    if((this.addPrice == null || this.addPrice == 0) || this.addProduct == null || (this.addQtd == 0 || this.addQtd == null) || this.addUn == null){
      return this.alert.errorPopUp("Todos os campos devem ser preenchidos");
    }
    
    const ids: number[] = this.lista.map(obj => {return obj.productId;});
    const max = Math.max(...ids)
    
    if(this.addUn == 'gr')
      this.addPrice = this.addPrice / this.addQtd

    let obj: Products = {
      productId: max + 1,
      name: this.addProduct,
      price: this.addPrice,
      qtd: this.addQtd,
      unidade: this.addUn
    }
    
    this.cartListService.insertCartList(this.idList, this.lista, obj).subscribe(
        () => {
        this.alert.successPopUp("Produto inserido com sucesso");
        this.getAllList();
        this.refreshTotal();
        this.setAddOpen(false);
        this.resetAdd();
      },
      (err) => {
        this.alert.errorPopUp("Erro ao inserir produto");
        console.log(err)
      }
    )
  }
  
  resetAdd() {
    this.addProduct = null;
    this.addPrice = 0;
    this.addQtd = null;
    this.addUn = null
  }
}
