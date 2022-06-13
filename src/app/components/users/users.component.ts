import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { User } from '../../interfaces/datamodel/user'
import { Router } from '@angular/router';
import { SessionServiceService } from '../../services/sessionService/session-service.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  usersResponse:any
  token: string = ''
  users: User[] = []
  constructor(
    private HttpService: HttpServiceService,
    private router: Router,
    private SessionService: SessionServiceService
  ) {
    this.token = this.SessionService.getToken()
    if (!this.token) this.router.navigateByUrl('/login')
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    
    this.HttpService.getAll('users', this.token)
      .subscribe(response => {
        this.usersResponse = response
        this.users = this.usersResponse
        if (this.users.length === undefined) {
          this.router.navigateByUrl('/login');
        } 
      });
  }
}
