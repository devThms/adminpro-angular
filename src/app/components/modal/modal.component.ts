import { Component, OnInit, Input } from '@angular/core';
import { Mesa } from 'src/app/models/mesa.model';
import { Centro } from 'src/app/models/centro.model';
import { TableService } from '../../services/votingCenter/table.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: []
})
export class ModalComponent implements OnInit {

  @Input() centroId: string;

  modalCreate: string = 'ocultar';
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  mesas: Mesa[] = [];

  mesa: Mesa = new Mesa(null, null);


  constructor(
    // tslint:disable-next-line:variable-name
    public _tableService: TableService
  ) { }

  ngOnInit() {
  }

  hideModalCreate() {
    this.modalCreate = 'ocultar';
  }

  showModalCreate() {
    this.modalCreate = '';
  }

  cargarMesas( id: string ) {

    this.cargando = true;

    this._tableService.cargarMesas( this.desde, id )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.mesas = resp.tables;
                          this.cargando = false;
                        });

  }

  crearMesa( mesa: Mesa) {

    this.mesa.localNumber = mesa.localNumber;
    this.mesa.nationalNumber = mesa.nationalNumber;
    this.mesa.center = this.centroId;

    console.log(this.mesa);

    this._tableService.crearMesa(this.mesa)
                                .subscribe( resp => {
                                  Swal.fire({
                                    type: 'success',
                                    title: 'Mesa de Votación Creada',
                                    text: 'Mesa Local No. ' + mesa.localNumber
                                  });
                                  this.hideModalCreate();
                                  this.cargarMesas(this.mesa.center);
                                });

    this.mesa.localNumber = null;
    this.mesa.nationalNumber = null;

  }


}
