import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpService) { }

  getContacts(username: string) {
    return this.http.get(`api/contacts/${username}`).pipe(
      map(res => res.map(data => new Contact(data.account_num, data.is_external, data.label, data.routing_num))),
      catchError(err => {
        console.log(err);
        return Observable.throw(err.statusText);
      })
    );
  }
  
  deposit() {

  }

  send() {

  }
}
