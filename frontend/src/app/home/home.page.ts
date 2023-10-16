import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CartListService } from 'src/shared/services/cartList.service';
import { CartList } from '../models/cart-list.model';
import { AlertService } from 'src/shared/services/alert.service';
import { SavedList } from '../models/saved-list.model';
import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit{
  public nomeLista!: string;
  public listId!: number;
  private editId!: number;
  public editNomeLista !: string;
  public lista : CartList[] = [];
  public savedList : SavedList[] = [];

  public isAddListModalOpen = false;
  public isEditListModalOpen = false;
  public isPreviousModalOpen = false;
  public isPreviousEditModalOpen = false;

  public newElement: string = '';
  public editNewElement: string = '';

  @ViewChild('swiper') swiperRef?: ElementRef;

  constructor(
    private alert: AlertService,
    private cartListService: CartListService
  ) {}

  ngOnInit(): void {
    this.getAllLists();
    this.getSavedList();
  }

  private getSavedList() {
    this.cartListService.getSavedList().subscribe(
      (response) => {
        this.savedList = response;
      }
    );
  }

  private getAllLists() {
    this.cartListService.getAllLists().pipe().subscribe({
      next: (response) => {
        this.lista = response;

        setTimeout(() => {
          this.swiperRef?.nativeElement.swiper.update();
        }, 100);
      },
      error: (e) => console.error(e),
      complete: () => {console.log("complete")}
    })
  }

  setOpen(isOpen: boolean, modalType: string) {
    switch(modalType){
      case "newList":
        this.nomeLista = '';
        this.isAddListModalOpen = isOpen;
      break;
      
      case "editListName":
        this.isEditListModalOpen = isOpen;
      break;

      case "previousList":
        this.newElement = '';
        this.isPreviousModalOpen = isOpen;
      break;

      case "previousEdit":
        this.isPreviousEditModalOpen = isOpen;
      break;
    }
  }

  openEditListNameModal(id: number, listName: string){
    this.editNomeLista = listName;
    this.listId = id;
    this.setOpen(true, 'editListName')
  }

  openEditPreviousNameModal(id: number, previousItem: string){
    this.editNewElement = previousItem;
    this.editId = id;
    this.setOpen(true, 'previousEdit')
  }

  deleteCartList(id: number){
    this.alert.confirmDelete()
      .then((result) => {
        if(result.isConfirmed){
          this.cartListService.deleteCartList(id).subscribe(
            () => {
              this.alert.successPopUp("Lista excluida com sucesso");
              this.getAllLists();
            },
            (err) => console.log(err)
          );
        }
      })
  }

  createList(){
    if(this.nomeLista.length == 0 || this.nomeLista == null)
      this.alert.errorPopUp("Insira um nome para a lista")
    else{
      this.cartListService.createNewList(this.nomeLista).subscribe(
        () => {
          this.setOpen(false, 'newList');
          this.getAllLists();
        },
        (err) => {
          this.alert.errorPopUp("Erro ao criar lista");
          console.log(err)
        }
      )
    }
  }
  alterListName(){
    if(this.editNomeLista.length == 0 || this.editNomeLista == null)
      this.alert.errorPopUp("Insira um nome para a lista")
    else{
      this.cartListService.AlterNewListName(this.listId, this.editNomeLista).subscribe(
        () => {
          this.setOpen(false, 'editListName');
          this.getAllLists();
        },
        (err) => {
          this.alert.errorPopUp("Erro ao alterar nome da lista");
          console.log(err)
        }
      )
    }
  }

  addPreviousList(){
    if(this.newElement == '')
      return this.alert.errorPopUp("Insira algum item!");
    this.cartListService.insertSavedList(this.newElement).subscribe(
      () => {
        this.alert.successPopUp("item adicionado!");
        this.getSavedList();
        this.setOpen(false, 'previous');
      },
      (err) => {
        console.log(err);
      }
    )
  }

  deletePreviousList(index: number){
    this.alert.confirmDelete()
      .then((result) => {
        if(result.isConfirmed)
          this.cartListService.deleteSavedList(index).subscribe(
            () => {
              this.alert.successPopUp("Excluido com sucesso!");
              this.getSavedList();
            },
            (err) => {
              console.log(err)
            }
        )
      })
  }
  updatePreviousItem(){
    if(this.editNewElement.length == 0 || this.editNewElement == null)
      this.alert.errorPopUp("Insira um nome para a lista")
    else{
      this.cartListService.UpdateSavedListItem(this.editId, this.editNewElement).subscribe(
        () => {
          this.alert.successPopUp("Item alterado com sucesso!");
          this.setOpen(false, 'previousEdit');
          this.getSavedList();
        },
        (err) => {
          this.alert.errorPopUp("Erro ao alterar nome do item");
          console.log(err)
        }
      )
    }
  }
}
