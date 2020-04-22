import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { empty } from 'rxjs';
import { AlertService } from './alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// Used by the homepage to get transaction history and account balance
export class AccountService {

  constructor(private http: HttpService, private alert: AlertService) { }

  // Get balance
  getAccountBalance(account: number) {
    return this.http.get(`api/balance/${account}`).pipe(
      map(res => Number(res)/100),
      catchError((error: HttpErrorResponse) => {
        var msg = 'Failed to load account balance';
        this.alert.error(msg, true);
        return empty();
      })
    );
  }

  // Get transaction history
  getTransactionHistory(account: number) {
    return this.http.get(`api/transactions/${account}`).pipe(
      map(res => res.map(data => new Transaction(data.timestamp, data.fromAccountNum, 
        data.fromRoutingNum, data.toAccountNum, data.toRoutingNum, data.amount))),
      catchError((error: HttpErrorResponse) => {
        var msg = 'Failed to load transaction history';
        this.alert.error(msg, true);
        return empty();
      })
    );
  }
}