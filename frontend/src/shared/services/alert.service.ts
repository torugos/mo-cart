import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() { }
  
  errorPopUp(msg: string){
    Swal.fire({
      icon: 'error',
      title: msg,
      timer: 2500,
      showConfirmButton: false,
      heightAuto: false
    })
  }

  successPopUp(msg: string){
    Swal.fire({
      icon: 'success',
      title: msg,
      timer: 2500,
      showConfirmButton: false,
      heightAuto: false
    })
  }

  confirmDelete() : Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: 'Confirmar exclusão?',
      text: 'Não será possível reverter a exclusão!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, Excluir!',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      heightAuto: false
    });
  }
}
