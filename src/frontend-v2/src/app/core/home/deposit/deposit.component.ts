import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'deposit-modal',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  validated: boolean = false;

  constructor(private transactions: TransactionService) { }

  ngOnInit(): void {
  }

  validate(form) {
  }

  deposit(form) {
  }
}
