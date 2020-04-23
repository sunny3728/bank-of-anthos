import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';
import { Contact } from 'src/app/models/contact.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'deposit-modal',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit, OnDestroy {
  
  @ViewChild('closeModal') closeModal: ElementRef;
  listener: Subscription;

  // User account info
  username: string;
  accountId: number;

  // Deposit from contact form
  validated: boolean = false;
  amount: number;
  savedContacts: Contact[] = [];
  selectedContact: Contact;
  newContact: Contact = new Contact(undefined, true, "", undefined);

  constructor(private transfer: TransferService, private auth: AuthService) { 
    this.username = this.auth.getUsername();
    this.accountId = this.auth.getAccount();
    // Update contacts on trigger from TransferService
    this.listener = this.transfer.listenForContacts().subscribe(
      (res) => { this.fetchContacts(); }
    );
  }

  ngOnInit(): void {
    this.fetchContacts();
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

  fetchContacts() {
    this.transfer.getContacts(this.username).subscribe(contacts => {
      this.savedContacts = contacts.filter(contact => contact.external);
      this.selectedContact = (this.savedContacts.length == 0) ? this.newContact : this.savedContacts[0];
    });
  }

  // Validate form on submit
  validate(form) {
    this.validated = true;
    if(form.valid == true) {
      if(this.selectedContact == this.newContact && this.newContact.label != "") this.createContact();
      this.deposit();
      this.resetAndClose();
    }
  }

  async createContact() {
    await this.transfer.newContact(this.username, this.newContact);
  }

  async deposit() {
    await this.transfer.deposit(this.selectedContact, `${this.accountId}`, "123456789", this.amount);
  }

  // Reset form fields, validation, and close modal
  resetAndClose() {
    this.newContact = new Contact(undefined, true, "", undefined);
    this.selectedContact = this.savedContacts[0];
    this.amount = undefined;
    this.validated = false;
    this.closeModal.nativeElement.click();
  }
}
