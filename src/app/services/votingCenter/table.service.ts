import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';

import { Mesa } from '../../models/mesa.model';
import { UsuarioService } from '../usuario/usuario.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarMesas( desde: number = 0, id: string) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/mesas/' + id + '?desde=' + desde;

    return this.http.get( url );

  }

  borrarMesa( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/mesas/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete( url );

  }

  buscarMesa( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/mesas/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.mesas) );

  }

  crearMesa( mesa: Mesa ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/mesas/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, mesa )
                .pipe(map((resp: any) => {
                  return resp.table;
                }));

  }

  actualizarMesa( mesa: Mesa ) {

    let url = URL_SERVICES + '/mesas/' + mesa._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, mesa )
                    .pipe(map( (resp: any) => {
                      return resp.table;
                    }));

  }

}
