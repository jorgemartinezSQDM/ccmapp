import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { SessionServiceService } from '../../services/sessionService/session-service.service'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logo: string = environment.logoClaro;
  spinner!: boolean;
  inputsError!: boolean;
  feedback = {
    show: false,
    code: "",
    error: false,
    warning: false,
    success: false,
  };
  username: String = ''
  password: String = ''
  token: string = ''
  elems: any = {};

  constructor(
    private HttpService: HttpServiceService,
    private router: Router,
    private SessionService: SessionServiceService
  ) {
    this.token = this.SessionService.getToken()
    console.log('token => ', this.token)
    if (this.token) this.router.navigateByUrl('/')
  }

  ngOnInit(): void { }

  getUsername(data: any) {
    this.username = data;
  }

  getPassword(data: any) {
    this.password = data;
  }

  login(): void {
    this.elems.username = document.getElementById("username") ? document.getElementById("username") : null;
    this.username = this.elems.username ? this.elems.username.value : this.username;
    this.elems.password = document.getElementById("password") ? document.getElementById("password") : null;
    this.password = this.elems.password ? this.elems.password.value : this.password;
    setTimeout(() => {
      this.spinner = true;
      if (this.username && this.password) {
        this.inputsError = false;
        this.HttpService.login(this.username, this.password).subscribe(response => {
          if (response) {
            this.SessionService.setToken(response.access_token);
            window.location.reload();
          } else {
            this.inputsError = true;
            this.feedback.code = "e0001";
            this.feedback.error = true;
            this.feedback.warning = false;
            this.feedback.success = false;
            this.feedback.show = true;
            setTimeout(() => {
              this.feedback.code = "";
              this.feedback.error = false;
              this.feedback.warning = false;
              this.feedback.success = false;
              this.feedback.show = false;
            }, 4000);
          }
        }, (error) => {
          this.inputsError = true;
          this.feedback.code = "e0001";
          this.feedback.error = true;
          this.feedback.warning = false;
          this.feedback.success = false;
          this.feedback.show = true;
          setTimeout(() => {
            this.feedback.code = "";
            this.feedback.error = false;
            this.feedback.warning = false;
            this.feedback.success = false;
            this.feedback.show = false;
          }, 4000);
        });
      } else {
        this.inputsError = true;
        this.feedback.code = "e0000";
        this.feedback.error = true;
        this.feedback.warning = false;
        this.feedback.success = false;
        this.feedback.show = true;
        setTimeout(() => {
          this.inputsError = false;
          this.feedback.code = "";
          this.feedback.error = false;
          this.feedback.warning = false;
          this.feedback.success = false;
          this.feedback.show = false;
        }, 4000);
      }
      this.spinner = false;
    }, 400);
  }
}
