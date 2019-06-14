
// tslint:disable-next-line:class-name
export class totalVoto {

    constructor(
        public validVotes?: number,
        public nullVotes?: number,
        public blankVotes?: number,
        public objectionVotes?: number,
        public user?: string,
        public table?: string,
        public profile?: string,
        public center?: string,
        public status?: boolean,
        // tslint:disable-next-line:variable-name
        public _id?: string
    ) {}

}
