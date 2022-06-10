import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {


  campaings:any

  constructor(private HttpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    
    this.HttpService.getAll('campaigns')
      .subscribe(campaings => {
        this.campaings = campaings
      });
  }

}
