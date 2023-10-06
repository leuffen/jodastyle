

export class JodaElementException {
    constructor(
        public message : string,
        public element : HTMLElement = null,
        public triggerCommand : string = null
    ) {
    }
}
