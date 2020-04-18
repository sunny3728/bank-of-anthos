import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  validated: boolean = false;
  maxDate: string = '';

  constructor(private account: AccountService) { 
  }

  ngOnInit(): void {
    // Set max date to 18 years ago; 18 is the minimum age to register for a bank account
    var today = new Date();
    //var max = new Date(today.setFullYear(today.getFullYear() - 18));
    //this.maxDate = max.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }

  validate(form) {
    console.log(form);
    if (form.value.password != form.value.passwordRepeat) {

    }
    if (form.valid) {
      //this.signup(form);
    }
    this.validated = true;
  }

  signup(form) {
  }

}
