import { Component, OnInit } from '@angular/core';
import { CartListService } from 'src/services/cartList.service';
import { Products } from '../models/products.model';
import { AlertService } from 'src/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { SavedList } from '../models/saved-list.model';
import { PhotoService } from 'src/services/photo.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.page.html',
  styleUrls: ['./cart-list.page.scss'],
})
export class CartListPage implements OnInit{
  
  constructor(
    private route: ActivatedRoute,
    private alert: AlertService,
    public photoService: PhotoService,
    private cartListService: CartListService) { }
  
  public nomeLista: string = '';
  public lista: Products[] = [];
  public savedList: SavedList[] = [];
  public total: string = '';
  public qtdItens: number = 0;
  private market!: string;
  private idList: number = Number(this.route.snapshot.paramMap.get('id')); 
  
  //Add config
  public isAddModalOpen = false;
  public addProduct: string | null = null;
  public addPrice: number | null = null;
  public addQtd: number | null = null;
  public addUn: string | null = 'un';
  
  //Edit config
  public isEditModalOpen = false;
  public isPhotoModalOpen = false;
  public editProductId: number | null = null;
  public editProduct: string | null = null;
  public editPrice: number | null = null;
  public editQtd: number | null = null;
  public editUn: string| null = null;

  public viewPhoto: string | null = null;
  public photoUrl: string | null = null;

  ngOnInit(){
    this.getAllList();
    this.getSavedList();
  }

  setPhotoOpen(isOpen: boolean){this.isPhotoModalOpen = isOpen;}
  setEditOpen(isOpen: boolean){this.isEditModalOpen = isOpen;}
  setAddOpen(isOpen: boolean){
    if(!isOpen)
      this.resetAdd();
    this.isAddModalOpen = isOpen;
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
        this.refreshSavedList();
      }
    )
  }

  itemViewPhoto(photo: string | null){
    this.setPhotoOpen(true);
    if(photo)
      this.viewPhoto = photo;
  }

  itemAddSaved(itemName: string, itemQtd: number, itemUn: string){
    this.setAddOpen(true);
    this.addProduct = itemName;
    this.addQtd = itemQtd;
    this.addUn = itemUn;
  }

  private getAllList() {
    this.cartListService.getListById(this.idList).subscribe(
      (response) => {
        this.nomeLista = response.listName;
        this.lista = response.products;
        this.total = response.total.toFixed(2);
        this.market = response.market;
        this.refreshQtdItens();
        this.refreshSavedList();
      });
  }

  refreshSavedList() {
    const savedNames = this.savedList.map(obj => {return obj.name;});

    let x = savedNames.filter(x => this.lista.some(item => item.name == x))
    this.savedList.forEach(
      el => {
        if(x.includes(el.name))
          el.selected = true;
        else
          el.selected = false;
      }
    )
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
    console.log(this.lista)

    let soma = 0;
    prices.forEach(element => {soma += element});

    console.log(soma)

    this.cartListService.updateTotal(soma, this.idList).subscribe(
      () => this.total = soma.toFixed(2),
      (err) => {
        console.log(err)
      }
    )
  }

  public delete(id: number){
    this.alert.confirmDelete()
      .then((result) => {
        if(result.isConfirmed){
          let objIndex = this.lista.findIndex(obj => obj.productId == id)
          this.lista.splice(objIndex, 1)
          this.cartListService.deleteCartProduct(this.idList, this.lista, Number(this.total)).subscribe(
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
    
    if(objEdit.unidade == 'gr')
      this.editPrice = objEdit.price * objEdit.qtd;
    else
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
      unidade: this.editUn,
      photo: this.photoUrl
    };

    Object.assign(this.lista[this.lista.findIndex(obj => obj.productId === this.editProductId)],obj)

    this.cartListService.updateCartList(this.idList,this.lista).subscribe({
      next:() => {
        this.alert.successPopUp("Produto Alterado com sucesso");
        this.setEditOpen(false);
        this.getAllList();
      },
      error:(err) => {
        this.alert.errorPopUp("Erro ao Alterar produto");
        console.log(err)
      },
      complete:() => {
        this.refreshTotal();
        this.photoUrl = null;
      }
    })
  }
  
  saveAdd(){
    if((this.addPrice == null || this.addPrice == 0) || this.addProduct == null || (this.addQtd == 0 || this.addQtd == null) || this.addUn == null){
      return this.alert.errorPopUp("Todos os campos devem ser preenchidos");
    }

    const ids: number[] = this.lista.map(obj => {return obj.productId;});
    let max = Math.max(...ids)
    max == -Infinity? max = 0 : max = max;
    
    
    if(this.addUn == 'gr')
      this.addPrice = this.addPrice / this.addQtd

    let obj: Products = {
      productId: max + 1,
      name: this.addProduct,
      price: this.addPrice,
      qtd: this.addQtd,
      unidade: this.addUn,
      market: this.market,
      photo: this.photoUrl
    }

    this.lista.splice(max, 0, obj)
    
    this.cartListService.insertCartList(this.idList, this.lista).subscribe({
      next:() => {
        this.alert.successPopUp("Produto inserido com sucesso");
        this.getAllList();
        this.setAddOpen(false);
        this.resetAdd();
      },
      error:(err) => {
        this.alert.errorPopUp("Erro ao inserir produto");
        this.lista.splice(max, 1)
        console.log(err)
      },
      complete:() => this.refreshTotal()
    })
  }
  
  private resetAdd() {
    this.photoUrl = null;
    this.addProduct = null;
    this.addPrice = null;
    this.addQtd = null;
    this.addUn = null
  }

  tirarFoto() {
    this.photoUrl = null;
    this.photoService.takePicture().subscribe(
      url => {
        if(url){
          fetch(url)
            .then(response => response.blob())
            .then(blob => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64Data = reader.result as string; // Converter o resultado para uma string
                this.photoUrl = base64Data;                
              }
              reader.readAsDataURL(blob);
            })
        }
        else {
          console.error('URL da foto é undefined.');
        }
      },
      error => console.error(error)
    );
  }
}
