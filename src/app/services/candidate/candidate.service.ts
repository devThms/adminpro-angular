import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICES } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Candidato } from '../../models/candidato.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarCandidatos( desde: number = 0) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos?desde=' + desde;

    return this.http.get( url );

  }

  obtenerCandidato( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos/' + id;

    return this.http.get( url )
                .pipe(map( (resp: any) => resp.candidate ));

  }

  borrarCandidato( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete( url );

  }

  crearCandidato( candidato: Candidato ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, candidato )
                .pipe(map((resp: any) => {
                  return resp.candidate;
                }));

  }

  buscarCandidato( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/candidatos/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.candidatos) );

  }

  actualizarCandidato( candidato: Candidato ) {

    let url = URL_SERVICES + '/candidatos/' + candidato._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, candidato )
                    .pipe(map( (resp: any) => {
                      return resp.candidate;
                    }));

  }
}
