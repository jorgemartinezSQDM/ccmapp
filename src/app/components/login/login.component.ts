import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { SessionServiceService } from '../../services/sessionService/session-service.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  username: String = ''
  password: String = ''
  token: string = ''
  constructor(
    private HttpService: HttpServiceService,
    private router: Router,
    private SessionService: SessionServiceService
  ) {
    this.token = this.SessionService.getToken()
    console.log('token => ', this.token)
    if (this.token) this.router.navigateByUrl('/')
  }

  ngOnInit(): void {

  }


  login(): void {
    this.HttpService.login(this.username, this.password).subscribe(response => {
      console.log(response.access_token)
      this.SessionService.setToken(response.access_token)
      window.location.reload();
    })
  }
}
