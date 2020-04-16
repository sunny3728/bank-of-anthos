import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
// Used by the homepage to get transaction history and account balance
export class AccountService {

  constructor(private http: HttpService) { }

  getAccountBalance(account: number) {
    return this.http.get(`api/balance/${account}`).pipe(
      map(res => Number(res)/100)
    );
  }

  getTransactionHistory(account: number) {
    return this.http.get(`api/transactions/${account}`).pipe(
      map(res => res.map(data => new Transaction(data.timestamp, data.fromAccountNum, 
        data.fromRoutingNum, data.toAccountNum, data.toRoutingNum, data.amount)))
    );
  }
}
