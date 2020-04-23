import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { empty, Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private triggerUpdateContacts = new BehaviorSubject<string>('');
  private triggerUpdateBalance = new BehaviorSubject<string>('');
  
  constructor(private http: HttpService, private alert: AlertService) { }

  listenForContacts(): Observable<any> {
    return this.triggerUpdateContacts.asObservable();
  }

  listenForBalance(): Observable<any> {
    return this.triggerUpdateBalance.asObservable();
  }

  // Retrieve all user contacts; filtered by type at the modal components
  getContacts(username: string) {
    return this.http.get(`api/contacts/${username}`).pipe(
      map(res => res.map(data => new Contact(data.account_num, data.is_external, data.label, data.routing_num))),
      catchError((error: HttpErrorResponse) => {
        var msg = 'Failed to retrieve user contacts';
        this.alert.error(msg, true);
        return empty();
      })
    );
  }
  
  // Create new contact in contacts service
  newContact(username: string, contact: Contact) {
    var body = {
      label: contact.label,
      account_num: `${contact.account}`,
      routing_num: `${contact.routing}`,
      is_external: contact.external
    };
    return this.http.post(`api/contacts/${username}`, body).subscribe(
      (res) => { this.triggerUpdateContacts.next('refresh'); },
      (error: HttpErrorResponse) => { 
        var msg = 'Failed to create new contact';
        this.alert.error(msg, true);
      }
    );
  }

  // Deposit to authenticated account
  deposit(contact: Contact, account_id: string, localRouting: string, amount: number) {
    var body = {
      fromAccountNum: `${contact.account}`,
      fromRoutingNum: `${contact.routing}`,
      toAccountNum: account_id,
      toRoutingNum: localRouting,
      amount: amount * 100
    };
    return this.http.post("api/transfer", body).subscribe(
      () => { 
        var msg = 'Deposit accepted';
        this.alert.success(msg, true);
        this.triggerUpdateBalance.next('refresh');
      },
      (error: HttpErrorResponse) => { 
        var msg = 'Deposit failed';
        this.alert.error(msg, true);
      }
    );
  }

  // Send payment to contact
  send(contact: Contact, account_id: string, localRouting: string, amount: number) {
    var body = {
      fromAccountNum: account_id,
      fromRoutingNum: localRouting,
      toAccountNum: `${contact.account}`,
      toRoutingNum: localRouting,
      amount: amount * 100
    };
    return this.http.post("api/transfer", body).subscribe(
      () => { 
        var msg = 'Payment accepted';
        this.alert.success(msg, true);
        this.triggerUpdateBalance.next('refresh');
      },
      (error: HttpErrorResponse) => { 
        var msg = 'Payment failed';
        this.alert.error(msg, true);
      }
    );
  }
}
