import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Transaction } from '../../models/transaction.model';
import { AccountService } from 'src/app/services/account.service';
import { TransferService } from 'src/app/services/transfer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  account_id: number;
  balance: number = 0;
  transactions: Transaction[] = [];
  listener: Subscription; 

  constructor(private account: AccountService, private auth: AuthService, private transfer: TransferService) { 
    this.account_id = auth.getAccount();
    // Update balance and transaction history on trigger from TransferService
    this.listener = this.transfer.listenForBalance().subscribe(
      // TODO: fix
      // Adding a delay produces more consistent updates to the component 
      (res) => { setTimeout(() => { this.ngOnInit() }, 500 )}
    );
  }

  ngOnInit(){
    // Initialize balance and transaction history
    this.fetchAccountBalance();
    this.fetchTransactionHistory();
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
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
    return amount === undefined ? "$---" : amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  }
}
