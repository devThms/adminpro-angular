import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuarios' ): any {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/images';

    if ( !img ) {
      return url + '/usuarios/xxx';
    }

    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    switch ( tipo ) {

      case 'usuarios':
        url += '/usuarios/' + img;
        break;

      case 'partidos':
        url += '/partidos/' + img;
        break;

      case 'candidatos':
        url += '/candidatos/' + img;
        break;

      default:
        console.log('tipo de imagen no existe, unicamente se permiten usuarios, partidos, candidatos');
        url += '/usuarios/xxx';

    }

    return url;


  }

}
