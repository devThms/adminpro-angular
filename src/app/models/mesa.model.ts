
export class Mesa {

    constructor(
        public localNumber: number,
        public nationalNumber: number,
        public center?: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public is_closed?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
