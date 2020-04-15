import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private authenticated: boolean = false;
  private token: string;

  constructor(private http: HttpClient) { }

  // Set the JWT token string that will be attached to each GET/POST request
  setHTTPAuth(auth: boolean, token?: string){
    this.authenticated = auth;
    this.token = token;
  }

  get(endpoint: string, params?: Object) {
    // Add token to request header if it exists
    const header = (this.authenticated) ? { Authorization: `Bearer ${this.token}` } : undefined;

    let requestParams = new HttpParams();
    if (params != null) {
      Object.getOwnPropertyNames(params).forEach(prop => {
        requestParams = requestParams.set(prop, params[prop]);
      });
    }

    return this.http.get(endpoint, {
      responseType: 'json',
      headers: header,
      params: requestParams
    });
  }

  post(endpoint: string, body?: any) {
    // Add token to request header if it exists
    const header = (this.authenticated) ? { Authorization: `Bearer ${this.token}` } : undefined;

    return this.http.post(endpoint, body, {
      responseType: 'json',
      observe: 'body',
      headers: header
    })
  }
}
