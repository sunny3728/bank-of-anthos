import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';
import { Contact } from 'src/app/models/contact.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'send-modal',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;

  // User account info
  username: string;
  accountId: number;

  // Payment to contact form
  validated: boolean = false;
  amount: number;
  savedContacts: Contact[] = [];
  selectedContact: Contact;
  newContact: Contact = new Contact(undefined, false, "", undefined);

  constructor(private transfer: TransferService, private auth: AuthService) { 
    this.username = this.auth.getUsername();
    this.accountId = this.auth.getAccount();
  }

  ngOnInit(): void {
    this.fetchContacts();
  }

  fetchContacts() {
    this.transfer.getContacts(this.username).subscribe(contacts => {
      this.savedContacts = contacts.filter(contact => !contact.external);
      if(this.savedContacts.length != 0) this.selectedContact = this.savedContacts[0];
    });
  }

  validate(form) {
    this.validated = true;
    if(form.valid == true) {
      if(this.selectedContact == this.newContact && this.newContact.label != "") this.createContact();
      this.send();
      this.resetAndClose(form);
    }
  }

  async createContact() {
    await this.transfer.newContact(this.username, this.newContact);
  }

  async send() {
    await this.transfer.send(this.selectedContact, `${this.accountId}`, "123456789", this.amount);
  }
  
  resetAndClose(form) {
    form.reset();
    this.selectedContact = this.savedContacts[0];
    this.validated = false;
    this.closeModal.nativeElement.click();
  }
}
