import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceService } from '../../services/sessionService/session-service.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Claro CCM';
  login = false
  token
  constructor(
    private router: Router,
    private SessionService: SessionServiceService
  ) {
    this.token = this.SessionService.getToken()
    console.log('token => ', this.token)
    if (!this.token) this.router.navigateByUrl('/login')
  }

  ngOnInit(): void {
    this.login = this.SessionService.getToken() ? true : false
  }

  logOut(): void {
    this.SessionService.logOut()
    window.location.reload();
  }

}
