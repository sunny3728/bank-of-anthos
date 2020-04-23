export class Contact {
    public account: number;
    public external: boolean;
    public label: string;
    public routing: number;

    constructor(account_num: string, external: boolean, label: string, routing_num: string){
        this.account = Number(account_num);
        this.external = external;
        this.label = label;
        this.routing = Number(routing_num);
    }
}