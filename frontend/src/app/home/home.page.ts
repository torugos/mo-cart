import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartListService } from 'src/services/cartList.service';
import { CartList } from '../models/cart-list.model';
import { AlertService } from 'src/services/alert.service';
import { SavedList } from '../models/saved-list.model';
import Swiper from 'swiper';
import { ActivatedRoute, Router } from '@angular/router';

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
  public newElementQtd: number | null = null;
  public newElementUn: string = '';

  public editNewElement: string = '';
  public editNewElementQtd: number | null  = null;
  public editNewElementUn: string = '';

  @ViewChild('swiper') swiperRef?: ElementRef;
  themeToggle = false;

  constructor(
    private alert: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private cartListService: CartListService
  ) {}
    
  ngOnInit(): void {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)');

    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));


    this.route.queryParams.subscribe((params) => {
      if(params['reload']){
        this.getAllLists();
        this.getSavedList();
      }
    })
    this.getAllLists();
    this.getSavedList();
  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
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
      error: (e) => console.error(e)
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

      case "previous":
        this.newElement = '';
        this.newElementQtd = null;
        this.newElementUn = '';
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

  openEditPreviousNameModal(id: number, previousItem: string, qtd: number, un: string){
    this.editNewElement = previousItem;
    this.editId = id;
    this.editNewElementQtd = qtd;
    this.editNewElementUn = un;
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
    if(this.newElement == '' || this.newElement == null || this.newElementQtd == null || this.newElementQtd <= 0 || this.newElementUn == '')
      return this.alert.errorPopUp("Insira algum item e quantidade validos!");

    this.cartListService.insertSavedList(this.newElement, this.newElementQtd, this.newElementUn).subscribe(
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
    if(this.editNewElement.length == 0 || this.editNewElement == null || this.editNewElementQtd == null || this.editNewElementQtd <= 0 || this.editNewElementUn == null)
      this.alert.errorPopUp("Insira um nome para a lista e quantidade validos")
    else{
      this.cartListService.UpdateSavedListItem(this.editId, this.editNewElement, this.editNewElementQtd, this.editNewElementUn).subscribe(
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
