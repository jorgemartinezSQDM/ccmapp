import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { SessionServiceService } from '../../services/sessionService/session-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Claro CCM';
  login = false;
  token;
  responsive!: ID_Responsive;

  constructor(
    private router: Router,
    private SessionService: SessionServiceService,
    private responsiveService: ResponsiveService,
    private wowService: NgwWowService,
  ) {
    this.wowService.init();
    this.token = this.SessionService.getToken()
    console.log('token => ', this.token)
    if (!this.token) this.router.navigateByUrl('/login')
  }

  ngOnInit(): void {
    this.login = this.SessionService.getToken() ? true : false
  }

  onResize(event: any): void {
    this.responsive = this.responsiveService.getResponsive(event.target.innerWidth);
  }

  logOut(): void {
    this.SessionService.logOut()
    window.location.reload();
  }

}
