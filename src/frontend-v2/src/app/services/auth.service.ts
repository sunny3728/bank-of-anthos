import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router, NavigationStart } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Handle JWT authentication
export class AuthService {
  
  private readonly TOKEN_NAME = 'token';
  private trigger = new Subject();
  private authenticated: boolean = false;
  private token: string;
  private user: User;

  constructor(private http: HttpService, private router: Router, private cookies: CookieService, private alert: AlertService) { 
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
    // Submit trigger on route changes
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.trigger.next();
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getName(): string { return this.user.name; }

  getUsername(): string { return this.user.username; }

  getAccount(): number { return this.user.accountID; }

  // Used by nav bar to get updates on authentication status
  listen(): Observable<any> {
    return this.trigger.asObservable();
  }
  
  // Handle user login to userservice
  login(username: string, password: string) {
    return this.http.get('api/login', {
      'username': username, 
      'password': password
    }).subscribe(
      (res: any) => { this.loginUser(res); },
      (error: HttpErrorResponse) => {
        var msg = (error.status == 404 || error.status == 401) ? 'Login Failed: Your username or password is incorrect.' : 'Login Failed: service unavailable.';
        this.alert.error(msg, false); 
      }
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
