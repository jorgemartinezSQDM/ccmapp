import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { SessionServiceService } from '../../services/sessionService/session-service.service'
import { Router } from '@angular/router';
import { Campaign } from '../../interfaces/datamodel/campaign'
@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {


  campaignsResponse: any
  token: string = ''
  campaigns: Campaign[] =[]
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

    this.HttpService.getAll('campaigns', this.token)
      .subscribe(response => {
        this.campaignsResponse = response
        this.campaigns = this.campaignsResponse
        if (this.campaigns.length === undefined) {
          this.router.navigateByUrl('/login');
        } 
      });
  }

}
