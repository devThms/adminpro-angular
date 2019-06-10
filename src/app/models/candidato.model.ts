
export class Candidato {

    constructor(
        public firstName: string,
        public lastName: string,
        public address: string,
        public phone: string,
        public political?: string,
        public profile?: string,
        public period?: string,
        public img?: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
