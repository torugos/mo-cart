import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartListService } from 'src/services/cartList.service';
import { CartList } from '../models/cart-list.model';
import { AlertService } from 'src/services/alert.service';
import { SavedList } from '../models/saved-list.model';
import Swiper from 'swiper';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../models/products.model';
import { map, min, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit{
  //Carrinho
  public marketList = ["Carrefour", "Sonda", "Assaí"]
  public bestBuy!: string;
  public lista : CartList[] = [];
  public savedList : SavedList[] = [];
  

  public listId!: number;
  public nomeLista: string| null = null;
  public marketOption: string | null = null;
  public newMarket: string| null = null;
  
  private editId!: number;
  public editNomeLista !: string;
  public editMarketOption: string | null = null

  //Modais
  public isAddListModalOpen = false;
  public isEditListModalOpen = false;
  public isPreviousModalOpen = false;
  public isPreviousEditModalOpen = false;

  //Lembretes
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
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // Initialize the dark theme based on the initial value of the prefers-color-scheme media query
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
  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }
  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  private getSavedList() {
    this.cartListService.getSavedList().pipe(
      switchMap((response: SavedList[]) => {
        this.savedList = response;
        const observables = response.map(savedElement =>
          this.cartListService.getAllLists().pipe(
            map((lists: any[]) => {
              const matchingProducts: Products[] = [].concat(...lists.map(list => list.products.filter((product: Products) => product.name.toUpperCase() == savedElement.name.toUpperCase())));
              if (matchingProducts.length > 0) {
                const productWithLowestPrice = matchingProducts.reduce((prev, current) => (prev.price < current.price ? prev : current));
                savedElement.cheapestMarket = productWithLowestPrice.market;
              }
            })
          )
        );
        return forkJoin(observables);
      })
      ).subscribe(
        () => {
          const cheapestMarkets: string[] = this.savedList
                .map((item) => item.cheapestMarket)
                .filter((market) => market !== null && market !== undefined);

          var melhorCompra: string[] = this.findMostFrequentElements(cheapestMarkets);
          console.log(melhorCompra)

          if(melhorCompra.length > 1){
            this.bestBuy = melhorCompra.join('/')
          }
          else
            this.bestBuy = melhorCompra[0];
        },
        (err) => {
          console.error(err);
        }
    );
  }

  private findMostFrequentElements(arr: string[]){
    if (arr.length === 0) {
      return [];
    }
  
    const frequencyMap: { [key: string]: number } = {};
    let highestFrequency = 1; // Inicializa com frequência 1
  
    for (const element of arr) {
      if (frequencyMap[element as string]) {
        frequencyMap[element as string]++;
      } else {
        frequencyMap[element as string] = 1;
      }
  
      if (frequencyMap[element as string] > highestFrequency) {
        highestFrequency = frequencyMap[element as string];
      }
    }
  
    const mostFrequentElements = [];
    for (const element in frequencyMap) {
      if (frequencyMap[element] === highestFrequency) {
        mostFrequentElements.push(element as any);
      }
    }
  
    return mostFrequentElements;
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
        this.nomeLista = null;
        this.marketOption = null;
        this.newMarket = null;
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

  openEditListNameModal(item: CartList){
    this.listId = item.id;
    this.editNomeLista = item.listName;
    this.editMarketOption = item.market;
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
            (err) => console.error(err)
          );
        }
      })
  }

  createList(){
    if(this.nomeLista == null || this.marketOption == null)
      this.alert.errorPopUp("Insira um nome para a lista e mercado")
    else{
      if(this.newMarket != null){
        this.marketList.push(this.newMarket)
        this.marketOption = this.newMarket
      }
      this.cartListService.createNewCart(this.nomeLista, this.marketOption).subscribe(
        () => {
          this.setOpen(false, 'newList');
          this.getAllLists();
        },
        (err) => {
          this.alert.errorPopUp("Erro ao criar lista");
          console.error(err)
        }
      )
    }
  }
  updateCart(){
    if(this.editNomeLista.length == 0 || this.editNomeLista == null)
      this.alert.errorPopUp("Insira um nome para a lista")
    else{
      this.cartListService.UpdateCart(this.listId, this.editNomeLista).subscribe(
        () => {
          this.setOpen(false, 'editListName');
          this.getAllLists();
        },
        (err) => {
          this.alert.errorPopUp("Erro ao alterar nome da lista");
          console.error(err)
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
        console.error(err);
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
              console.error(err)
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
          console.error(err)
        }
      )
    }
  }
}
