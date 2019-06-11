
export class Voto {

    constructor(
        public time?: string,
        public date?: string,
        public user?: string,
        public table?: string,
        public profile?: string,
        public political?: string,
        public center?: string,
        public amount?: number,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
