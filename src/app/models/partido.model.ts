
export class Partido {

    constructor(
        public name: string,
        public address: string,
        public phone: string,
        public foundation: string,
        public logotype?: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
