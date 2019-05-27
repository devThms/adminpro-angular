import { Partido } from './partido.model';
import { Perfil } from './perfil.model';
import { Periodo } from './periodo.model';

export class Candidato {

    constructor(
        public firstName: string,
        public lastName: string,
        public address: string,
        public phone: string,
        public political: Partido,
        public profile: Perfil,
        public period: Periodo,
        public img?: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
