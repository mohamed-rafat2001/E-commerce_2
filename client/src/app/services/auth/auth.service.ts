import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  url: string = 'http://localhost:3000/'
  //create user
  createUser(body: any) {
    return this.http.post(this.url + 'singUp', body)
  }
  //login
  login(body: any) {
    return this.http.post(this.url + "login", body)
  }
}
