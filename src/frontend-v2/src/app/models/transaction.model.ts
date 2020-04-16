export class Transaction {
    public timestamp: Date;
    public fromAccountNum: number;
    public fromRoutingNum: number;
    public toAccountNum: number;
    public toRoutingNum: number;
    public amount: number;

    constructor(time: string, fromAccount: string, fromRouting: string, toAccount: string, toRouting: string, amt: number){
        this.timestamp = new Date(time);
        this.fromAccountNum = Number(fromAccount);
        this.fromRoutingNum = Number(fromRouting);
        this.toAccountNum = Number(toAccount);
        this.toRoutingNum = Number(toRouting);
        this.amount = amt/100;
    }
}