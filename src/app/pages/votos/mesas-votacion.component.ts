import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Centro } from '../../models/centro.model';
import { Mesa } from '../../models/mesa.model';
import { Perfil } from '../../models/perfil.model';
import { Partido } from '../../models/partido.model';
import { Voto } from '../../models/voto.model';

import { PoliticalProfileService,
        VotingCenterService,
        TableService,
        PoliticalPartyService,
        UsuarioService,
        VotingControlService
      } from '../../services/service.index';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-mesas-votacion',
  templateUrl: './mesas-votacion.component.html',
  styles: []
})
export class MesasVotacionComponent implements OnInit {

  centro: Centro = new Centro('', '', 0);
  voto: Voto = new Voto(null, null);
  mesa: Mesa = new Mesa(null, null);
  votosRegistrados: Voto[] = [];
  mesas: Mesa[] = [];
  perfiles: Perfil[] = [];
  partidos: Partido[] = [];

  // Variables para el manejo de arrays en registro de votos
  date: Date = new Date();
  votos: any[] = [];
  partidosId: any[] = [];
  votosId: any[] = [];

  desde: number = 0;
  limit: number = null;
  totalRegistros: number = 0;
  cargando: boolean = true;

  modalRegister: string = 'ocultar';
  modalUpdateRegister: string = 'ocultar';
  modalSelectionProfile: string = 'ocultar';

  constructor(
    // tslint:disable-next-line:variable-name
    public _votingCenterService: VotingCenterService,
    // tslint:disable-next-line:variable-name
    public _tableService: TableService,
    // tslint:disable-next-line:variable-name
    public _politicalProfileService: PoliticalProfileService,
    // tslint:disable-next-line:variable-name
    public _politicalPartyService: PoliticalPartyService,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService,
    // tslint:disable-next-line:variable-name
    public _votingControlService: VotingControlService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:no-string-literal
      const id = params['id'];

      this.obtenerCentro(id);
      this.cargarMesas(id);

    });
   }

  ngOnInit() {

    this._politicalProfileService.cargarPerfiles( this.desde )
                        .subscribe( (resp: any) => {
                          this.perfiles = resp.profiles;
                        });

    this._politicalPartyService.cargarPartidos( this.desde, this.limit )
                    .subscribe( (resp: any) => {
                      this.partidos = resp.politicals;
                    });

  }

  obtenerCentro( id: string ) {

    this._votingCenterService.obtenerCentro( id )
          .subscribe( center => {
            this.centro = center;
          });

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

  // Servicios para Mesas de Votacion

  cambiarDesde( valor: number ) {

    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarMesas(this.centro._id);
  }

  buscarMesas( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMesas(this.centro._id);
      return;
    }

    this._tableService.buscarMesa( termino )
    .subscribe( (mesas: Mesa[]) => {
      this.mesas = mesas;
    });
  }

  hideModalRegister() {
    this.modalRegister = 'ocultar';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.votos.length; i++) {
      this.votos[i] = null;
    }
    this.voto.profile = null;
  }

  showModalRegister( id: string ) {
    this.voto.table = id;
    this.modalRegister = '';
  }

  showModalRegisterTwo() {
    this.modalRegister = '';
  }

  hideModalUpdateRegister() {
    this.modalUpdateRegister = 'ocultar';

  }

  showModalUpdateRegister() {
    this.modalUpdateRegister = '';
  }

  hideModalSelection() {
    this.modalSelectionProfile = 'ocultar';
  }

  showModalSelection( id: string ) {
    this.voto.table = id;
    this.modalSelectionProfile = '';
  }

  // Función para asociar un array en ngFor
  myCustomTrackBy(index) { return index; }

  registroVotos( voto: Voto ) {

    const fecha: string = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
    const hora: string = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();

    this.voto.profile = voto.profile;
    this.voto.user = this._usuarioService.usuario._id;
    this.voto.date = fecha;
    this.voto.time = hora;

    this._votingControlService.cargarVotos(this.desde, this.voto.table, this.voto.profile)
        .subscribe( (resp: any) => {
          if ( resp.total !== 0 ) {
            this.hideModalRegister();
            Swal.fire({
              type: 'error',
              title: 'Denegado',
              text: 'La mesa seleccionada ya cuenta con votos registrados para este perfil'
            });

          } else {

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.votos.length; i++) {
                this.voto.amount = this.votos[i];
                this.voto.political = this.partidosId[i];

                this._votingControlService.crearVoto(this.voto)
                                          .subscribe();

                this.votos[i] = null;

            }

            this.hideModalRegister();

            Swal.fire({
              type: 'success',
              title: 'Registrado',
              text: 'Los votos fueron registrados exitosamente'
            });

          }

      });

  }


  obtenerVotos( voto: Voto ) {

    this.voto.profile = voto.profile;

    this._votingControlService.cargarVotos(this.desde, this.voto.table, this.voto.profile)
        .subscribe((resp: any) => {
          this.votosRegistrados = resp.controls;
          this.totalRegistros = resp.total;
        });

    this.hideModalSelection();
    this.showModalUpdateRegister();
  }

  updateVotos( voto: Voto ) {

    const fecha: string = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
    const hora: string = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();

    this.voto.user = this._usuarioService.usuario._id;
    this.voto.date = fecha;
    this.voto.time = hora;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.votos.length; i++) {
      this.voto.amount = this.votos[i];
      this.voto.political = this.partidosId[i];
      this.voto._id = this.votosId[i];

      this._votingControlService.actualizarVoto(this.voto)
                                .subscribe();

      this.votos[i] = null;
    }

    this.hideModalUpdateRegister();

    Swal.fire({
      type: 'success',
      title: 'Actualizados',
      text: 'Los votos fueron actualizados exitosamente'
    });

  }

  cerrarMesa( mesa: Mesa ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea cerrar la mesa de votación',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        mesa.is_closed = true;

        this._tableService.actualizarMesa( mesa )
                            .subscribe( cerrada => {
                              this.cargarMesas(this.centro._id);
                            });

        swalWithBootstrapButtons.fire(
          'Cerrada!',
          'La mesa de votación ha sido cerrada',
          'success'
        );

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Accion cancelada por el usuario',
          'error'
        );
      }
    });

  }





}
