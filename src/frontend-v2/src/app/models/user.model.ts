export class User {
    public name: string;
    public username: string;
    public accountID: number;

    constructor(name: string, user: string, account: number){
        this.name = name;
        this.username = user;
        this.accountID = Number(account);
    }
}