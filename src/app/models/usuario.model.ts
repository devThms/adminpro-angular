export class Usuario {

    constructor(
        public name: string,
        public email: string,
        public password: string,
        public img?: string,
        public role?: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
