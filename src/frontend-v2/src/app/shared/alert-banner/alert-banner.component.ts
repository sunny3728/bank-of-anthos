import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Alert, AlertType } from 'src/app/models/alert.model';

@Component({
  selector: 'alert-banner',
  templateUrl: './alert-banner.component.html',
  styleUrls: ['./alert-banner.component.css']
})
export class AlertBannerComponent implements OnInit {

  alert: Alert;
  
  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.listen().subscribe(
      (alert: Alert) => { 
        this.alert = alert;
      }
    );
  }

  getIcon(type: AlertType): string {
    return (type == AlertType.Error) ? 'error' : 'check_circle';
  }

  getAlertClass(type: AlertType): string {
    return (type == AlertType.Error) ? 'alert-danger' : 'alert-success';
  }

  dismissed() {
    this.alert = null;
  }

}
