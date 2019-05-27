
export class Periodo {

    constructor(
        public period: string,
        public year: string,
        public dateVoting: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
