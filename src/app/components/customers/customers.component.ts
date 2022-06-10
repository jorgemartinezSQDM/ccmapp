import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import {Customer} from '../../interfaces/datamodel/customer'

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers:any

  constructor(private HttpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    
    this.HttpService.getAll('customers')
      .subscribe(customers => {
        this.customers = customers
        console.log(this.customers)
      });
  }

}
