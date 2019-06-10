import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CandidateService } from '../../services/candidate/candidate.service';
import { PoliticalPartyService } from '../../services/politicalParty/political-party.service';
import { PoliticalProfileService } from '../../services/politicalProfile/political-profile.service';
import { ParticipationPeriodService } from '../../services/participationPeriod/participation-period.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import { Partido } from '../../models/partido.model';
import { Perfil } from '../../models/perfil.model';
import { Periodo } from '../../models/periodo.model';
import { Candidato } from '../../models/candidato.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidato',
  templateUrl: './candidato.component.html',
  styles: []
})
export class CandidatoComponent implements OnInit {

  partidos: Partido[] = [];
  perfiles: Perfil[] = [];
  periodos: Periodo[] = [];
  candidato: Candidato = new Candidato('', '', '', '', null, null, null, '', true, '');
  partido: Partido = new Partido('', '', '', '');
  perfil: Perfil = new Perfil('', '');
  desde: number = 0;

  constructor(
    // tslint:disable-next-line:variable-name
    public _candidateService: CandidateService,
    // tslint:disable-next-line:variable-name
    public _politicalPartyService: PoliticalPartyService,
    // tslint:disable-next-line:variable-name
    public _politicalProfileService: PoliticalProfileService,
    // tslint:disable-next-line:variable-name
    public _participationPeriodService: ParticipationPeriodService,
    // tslint:disable-next-line:variable-name
    public _modalUploadService: ModalUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {

    activatedRoute.params.subscribe( params => {

      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:no-string-literal
      const id = params['id'];

      if ( id !== 'nuevo' ) {
        this.obtenerCandidato(id);
      }

    });
  }

  ngOnInit() {

    this._politicalPartyService.cargarPartidos( this.desde )
                        .subscribe( (resp: any) => {
                          this.partidos = resp.politicals;
                        });

    this._politicalProfileService.cargarPerfiles( this.desde )
                        .subscribe( (resp: any) => {
                          this.perfiles = resp.profiles;
                        });

    this._participationPeriodService.cargarPeriodos( this.desde )
                        .subscribe( (resp: any) => {
                          this.periodos = resp.periods;
                        });

    this._modalUploadService.notification
        .subscribe( resp => {
          this.candidato.img = resp.candidatoActualizado.img;
        });

  }

  obtenerCandidato( id: string ) {

    this._candidateService.obtenerCandidato( id )
          .subscribe( candidate => {

            this.candidato = candidate;
            this.candidato.political = candidate.political._id;
            this.candidato.profile = candidate.profile._id;
            this.candidato.period = candidate.period._id;

            this.cambioPartido(this.candidato.political);
            this.cambioPerfil(this.candidato.profile);

          });

  }

  crearCandidato( candidato: Candidato ) {

    this.candidato = candidato;

    this._candidateService.crearCandidato( this.candidato )
                          .subscribe( candidate => {
                            this.candidato = candidate;
                            this.router.navigate(['/candidato', candidate._id]);
                          });

  }

  cambioPartido( id: string ) {

    this._politicalPartyService.obtenerPartido( id )
                              .subscribe( political => {
                                this.partido = political;
                              });

  }

  cambioPerfil( id: string ) {

    this._politicalProfileService.obtenerPerfil( id )
                                .subscribe( profile => {
                                  this.perfil = profile;
                                });
  }

  cambiarFoto() {

    this._modalUploadService.showModal( 'candidatos', this.candidato._id );
  }

}
