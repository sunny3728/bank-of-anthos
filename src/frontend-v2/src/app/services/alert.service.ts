import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Alert, AlertType } from '../models/alert.model';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
// Used to trigger the alertbanner component on Http error/success
export class AlertService {

  private trigger = new Subject<Alert>();
  
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.trigger.next(null);
      }
    });
   }

  listen(): Observable<any> {
    return this.trigger.asObservable();
  }

  error(error: string, dismissable: boolean) {
    console.log(error);
    this.trigger.next(new Alert(AlertType.Error, error, dismissable));
  }

  success(success: string, dismissable: boolean) {
    console.log(success);
    this.trigger.next(new Alert(AlertType.Success, success, dismissable));
  }
}
