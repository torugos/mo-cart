import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CartListService } from 'src/shared/services/cartList.service';
import { CartList } from '../models/cart-list.model';
import { AlertService } from 'src/shared/services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

  swiperEl = document.querySelector('swiper-container');
  buttonEl = document.querySelector('button');
  
  public nomeLista!: string;
  public lista : CartList[] = []
  public isModalOpen = false
  constructor(
    private alert: AlertService,
    private cartListService: CartListService
  ){}

  ngOnInit(): void {
    this.getAllLists();
  }

  // isPopoverOpen: boolean[];
  isPopoverOpen: boolean[] = Array(this.lista.length).fill(false);

  abrirPopover(event : Event, index: number) {
    // Fechar todos os popovers abertos anteriormente
    this.fecharTodosPopovers();
    console.log(event, index)

    // Abrir o popover associado ao índice clicado
    this.isPopoverOpen[index] = true;
  }

  fecharPopover(index: number) {
    // Fechar o popover associado ao índice clicado
    this.isPopoverOpen[index] = false;
  }

  fecharTodosPopovers() {
    // Fechar todos os popovers
    this.isPopoverOpen.fill(false);
  }

  private getAllLists() {
    this.cartListService.getAllLists().subscribe(
      (response) => {
        this.lista = response;
      }
    );
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  deleteList(id: number){
    this.cartListService.deleteList(id).subscribe(
      () => {
        this.alert.successPopUp("Lista deletada com sucesso");
        this.getAllLists();
      },
      (err) => console.log(err)
    )
  }

  createList(){
    this.cartListService.createNewList(this.nomeLista).subscribe(
      () => {
        this.getAllLists();
        this.setOpen(false);
      },
      (err) => {
        this.alert.errorPopUp("Erro ao criar lista");
        console.log(err)
      }
    )
  }
}
