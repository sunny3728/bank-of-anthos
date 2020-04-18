import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'send-modal',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {

  validated: boolean = false;

  constructor(private transactions: TransactionService) { }

  ngOnInit(): void {
  }

  validate(form) {
  }

  send(form) {
  }
}
