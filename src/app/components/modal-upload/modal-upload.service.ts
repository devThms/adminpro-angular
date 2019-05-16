import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;
  public ocultar: string = 'ocultar';
  public notification = new EventEmitter<any>();

  constructor() { }

  showModal( tipo: string, id: string ) {
    this.ocultar = '';
    this.tipo = tipo;
    this.id = id;
  }

  hideModal() {
    this.ocultar = 'ocultar';
    this.tipo = null;
    this.id = null;
  }
}
