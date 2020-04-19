import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  validated: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.username = environment.default_username;
    this.password = environment.default_password;
  }

  validate(form) {
    if (form.valid) {
      this.login(form);
    }
    this.validated = true;
  }

  async login(form) {
    await this.auth.login(form.value.username, form.value.password);
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
