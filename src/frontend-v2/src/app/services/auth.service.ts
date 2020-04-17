import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
// Handle JWT authentication
export class AuthService {
  
  private readonly TOKEN_NAME = 'token';
  private authenticated: boolean = false;
  private token: string;
  private user: User;

  constructor(private http: HttpService, private router: Router, private cookies: CookieService) { 
    var jwtCookie = this.cookies.get(this.TOKEN_NAME);
    if (jwtCookie) {
      // Found JWT token; pull user attributes
      this.token = jwtCookie;
      const jwt = new JwtHelperService();
      var decoded = jwt.decodeToken(this.token);
      this.user = new User(decoded.name, decoded.user, decoded.acct);
      this.http.setHTTPAuth(true, this.token);
      this.authenticated = true;
    }
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getName(): string { return this.user.name; }

  getUsername(): string { return this.user.username; }

  getAccount(): number { return this.user.accountID; }

  // Handle user login to userservice
  login(username: string, password: string) {
    return this.http.get('api/login', {
      'username': username, 
      'password': password
    }).subscribe(
      (res: any) => { this.loginUser(res); },
      (error) => { console.error(error); }
    );
  }

  // Handle user logout
  logout() {
    delete this.token;
    delete this.user;
    this.cookies.delete(this.TOKEN_NAME);
    this.http.setHTTPAuth(false);
    this.authenticated = false;
    this.router.navigateByUrl('/login');
  }

  // Handle successful userservice response on login
  private loginUser(res: any) {
    // Save JWT in cookies
    this.token = res.token;
    const jwt = new JwtHelperService();
    var decoded = jwt.decodeToken(this.token);
    let max = decoded.exp - decoded.iat;
    this.cookies.set(this.TOKEN_NAME, this.token, max);

    // Set user props and attach token to HttpService
    this.user = new User(decoded.name, decoded.user, decoded.acct);
    this.http.setHTTPAuth(true, this.token);
    this.authenticated = true;
    this.router.navigateByUrl('');
  }
}
