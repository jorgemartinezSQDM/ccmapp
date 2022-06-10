import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:any

  constructor(private HttpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    
    this.HttpService.getAll('users')
      .subscribe(users => {
        this.users = users
      });
  }
}
