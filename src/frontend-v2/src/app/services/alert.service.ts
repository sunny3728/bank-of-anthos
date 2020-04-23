import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Alert, AlertType } from '../models/alert.model';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
// Used to trigger the alert-banner component on Http error/success
export class AlertService {

  private trigger = new Subject<Alert>();
  
  constructor(private router: Router) {
    // Clear alerts on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.trigger.next(null);
      }
    });
   }

  // Return Observable for components to subscribe
  listen(): Observable<any> {
    return this.trigger.asObservable();
  }

  // AlertType.Error; display error css
  error(error: string, dismissable: boolean) {
    this.trigger.next(new Alert(AlertType.Error, error, dismissable));
  }

  // AlertType.Success; display success css
  success(success: string, dismissable: boolean) {
    this.trigger.next(new Alert(AlertType.Success, success, dismissable));
  }
}
