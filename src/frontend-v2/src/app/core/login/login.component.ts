import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  default_user: string = environment.bank_username;
  default_password: string = environment.bank_password;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  async login(form) {
    try {
      await this.auth.login(form.value.username, form.value.password); 
    } catch (err) {
      console.log('caught error');
    }
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
