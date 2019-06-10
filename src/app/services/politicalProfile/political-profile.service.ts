import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { Perfil } from '../../models/perfil.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PoliticalProfileService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarPerfiles( desde: number = 0) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/perfiles?desde=' + desde;

    return this.http.get( url );

  }

  obtenerPerfil( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/perfiles/' + id;

    return this.http.get( url )
                .pipe(map( (resp: any) => {
                  console.log(resp.profile);
                  return resp.profile;
                } ));

  }

  borrarPerfil( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/perfiles/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete( url );

  }

  crearPerfil( perfil: Perfil ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/perfiles/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, perfil )
                .pipe(map((resp: any) => {
                  return resp.profile;
                }));

  }

  buscarPerfil( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/perfiles/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.perfiles) );

  }

  actualizarPerfil( perfil: Perfil ) {

    let url = URL_SERVICES + '/perfiles/' + perfil._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, perfil )
                    .pipe(map( (resp: any) => {
                      return resp.profile;
                    }));

  }

}
