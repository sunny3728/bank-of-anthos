import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { Contact } from 'src/app/models/contact.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'deposit-modal',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  validated: boolean = false;
  addExternal: boolean = false;
  username: string;
  contacts: Contact[] = [];

  // Deposit form
  selectedAccount: Contact;
  external_account_num: string;
  external_routing_num: string;
  external_label: string;
  amount: number;

  constructor(private transactions: TransactionService, private auth: AuthService) { 
    this.username = this.auth.getUsername();
  }

  ngOnInit(): void {
    this.fetchContacts();
  }

  fetchContacts() {
    this.transactions.getContacts(this.username).subscribe(contacts => {
      this.contacts = contacts.filter(contact => contact.external);
      if(this.contacts.length != 0) this.selectedAccount = this.contacts[0];
    });
  }

  onAccountChange(value: string) {
    this.addExternal = value == 'add';
  }

  validate(form) {
    console.log(form);
    if (form.valid) {
      //this.deposit(form);
    }
    this.validated = true;
  }

  deposit(form) {
  }

  reset(form) {
    form.resetForm();
  }
}
