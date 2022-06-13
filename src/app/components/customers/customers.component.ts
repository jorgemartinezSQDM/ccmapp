import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { Customer } from '../../interfaces/datamodel/customer'
import { Router } from '@angular/router';
import { SessionServiceService } from '../../services/sessionService/session-service.service'


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customerResponse:any
  customers: Customer[] = []
  token: string = ''
  
  constructor(
    private HttpService: HttpServiceService,
    private router: Router,
    private SessionService: SessionServiceService
  ) {

    this.token = this.SessionService.getToken()
    console.log('token => ', this.token)
    if (!this.token) this.router.navigateByUrl('/login')
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    
    this.HttpService.getAll('customers', this.token)
      .subscribe(customers => {

        
        this.customerResponse = customers
        this.customers = this.customerResponse
        
        if (this.customers.length === undefined) {
          this.router.navigateByUrl('/login');
        } 
        
      });
  }



}
