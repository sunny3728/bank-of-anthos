import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message: string = '';
  account_id: number = 7595821437;
  balance: number = 4230;
  obj: Object;

  constructor(private _http: HttpService) { }

  ngOnInit(){
  }

}
