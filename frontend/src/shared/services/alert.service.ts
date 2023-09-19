import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

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

}
