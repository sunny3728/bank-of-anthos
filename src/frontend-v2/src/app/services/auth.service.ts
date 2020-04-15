import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly TOKEN_NAME = 'token';
  private authenticated: boolean = false;
  private token: string;

  private user: string;
  private username: string;
  private accountID: number;

  constructor(private http: HttpService, private router: Router, private cookies: CookieService) { 
    const jwtres = localStorage.getItem(this.TOKEN_NAME);
    if (jwtres) {
      console.log('JWT retrieved...logged in.');
      const jwtJson = JSON.parse(jwtres);
      console.log(jwtJson);
      this.token = jwtres;
      this.http.setHTTPAuth(true, this.token);
      this.authenticated = true;
    }
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getName(): string { return this.user; }

  getUsername(): string { return this.username; }

  getAccount(): number { return this.accountID; }

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
    this.http.setHTTPAuth(false);
    delete this.token;

    localStorage.clear();
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
    this.setUserAttributes(decoded);
    this.http.setHTTPAuth(true, this.token);
    this.authenticated = true;
    this.router.navigateByUrl('');
  }

  private setUserAttributes(decodedToken: any){
    this.username = decodedToken.user;
    this.accountID = Number(decodedToken.acct);
    this.user = decodedToken.name;
  }
}
