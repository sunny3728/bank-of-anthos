import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Used by the homepage to get transaction history and account balance
export class AccountService {

  constructor(private http: HttpService) { }

  getAccountBalance(account: number) {
    return this.http.get(`api/balance/${account}`).pipe(
      map(res => Number(res)/100),
      catchError(err => {
        console.log(err);
        return Observable.throw(err.statusText);
      })
    );
  }

  getTransactionHistory(account: number) {
    return this.http.get(`api/transactions/${account}`).pipe(
      map(res => res.map(data => new Transaction(data.timestamp, data.fromAccountNum, 
        data.fromRoutingNum, data.toAccountNum, data.toRoutingNum, data.amount))),
      catchError(err => {
        console.log(err);
        return Observable.throw(err.statusText);
      })
    );
  }
}