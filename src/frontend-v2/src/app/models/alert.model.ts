export class Alert {
    public type: AlertType;
    public message: string;
    public dismissable: boolean;

    constructor(type: AlertType, message: string, dismissable: boolean){
        this.type = type;
        this.message = message;
        this.dismissable = dismissable;
    }
}

export enum AlertType {
    Success,
    Error
}