import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';
import { Contact } from 'src/app/models/contact.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'send-modal',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit, OnDestroy {

  @Input() balance: number = 0;
  @ViewChild('closeModal') closeModal: ElementRef;
  listener: Subscription;

  // User account info
  username: string;
  accountId: number;

  // Payment to contact form
  validated: boolean = false;
  amount: number;
  savedContacts: Contact[] = [];
  selectedContact: Contact;
  newContact: Contact = new Contact(undefined, false, "", "123456789");

  constructor(private transfer: TransferService, private auth: AuthService) { 
    this.username = this.auth.getUsername();
    this.accountId = this.auth.getAccount();
    // Update contacts on trigger from TransferService
    this.listener = this.transfer.listenForContacts().subscribe(
      (res) => { this.ngOnInit(); }
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
      this.savedContacts = contacts.filter(contact => !contact.external);
      this.selectedContact = (this.savedContacts.length == 0) ? this.newContact : this.savedContacts[0];
    });
  }

  // Validate form on submit
  validate(form) {
    this.validated = true;
    if(form.valid == true) {
      if(this.selectedContact == this.newContact && this.newContact.label != "") this.createContact();
      this.send();
      this.resetAndClose();
    }
  }

  async createContact() {
    await this.transfer.newContact(this.username, this.newContact);
  }

  async send() {
    await this.transfer.send(this.selectedContact, `${this.accountId}`, "123456789", this.amount);
  }
  
  // Reset form fields, validation, and close modal
  resetAndClose() {
    this.newContact = new Contact(undefined, false, "", undefined);
    this.selectedContact = this.savedContacts[0];
    this.amount = undefined;
    this.validated = false;
    this.closeModal.nativeElement.click();
  }
}
