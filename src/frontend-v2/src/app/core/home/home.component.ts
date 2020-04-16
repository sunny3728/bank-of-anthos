import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Transaction } from '../../models/transaction.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  account_id: number;
  balance: number;
  transactions: Transaction[] = [];

  constructor(private account: AccountService, private auth: AuthService) { 
    this.account_id = auth.getAccount();
  }

  ngOnInit(){
    this.fetchAccountBalance();
    this.fetchTransactionHistory();
  }

  fetchTransactionHistory() {
    this.account.getTransactionHistory(this.account_id).subscribe(history => this.transactions = history);
  }

  fetchAccountBalance() {
    this.account.getAccountBalance(this.account_id).subscribe(amount => this.balance = amount);
  }

  formatTimestampMonth(timestamp: Date) {
    return timestamp.toDateString().split(' ')[1];
  }

  formatTimestampDay(timestamp: Date) {
    return timestamp.getDate();
  }

  formatCurrency(amount: number) {
    return amount == 0 || amount === undefined ? "$---" : `$${amount.toFixed(2)}`;
  }
}
