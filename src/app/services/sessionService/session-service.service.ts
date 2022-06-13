import { Injectable } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  constructor(private cookies: CookieService) { }

  setToken(token: string) {
    this.cookies.set('token', token)
  }
  getToken() {
    return this.cookies.get("token");
  }

  logOut() {
    this.cookies.delete("token");
  }
  
}
