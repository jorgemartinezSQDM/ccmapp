import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { ID_Menu } from 'src/app/interfaces/datamodel/menu';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';
import { CommonService } from 'src/app/services/common/common.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { environment } from 'src/environments/environment';
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
  logo: string = environment.logoClaro;
  isotipo: string = environment.isoClaro;
  hide!: boolean;
  listMenu!: ID_Menu[];
  listActionsProfile!: ID_Menu[];
  showNavigation!: boolean;
  collapse!: boolean;
  fullItemsNav: boolean = true;
  stateProfile!: string;
  modeDialog!: boolean;

  constructor(
    private router: Router,
    private SessionService: SessionServiceService,
    private responsiveService: ResponsiveService,
    private wowService: NgwWowService,
    private commonService: CommonService,
  ) {
    this.wowService.init();
    this.listMenu = this.commonService.getDataLocal("menu");
    this.listActionsProfile = this.commonService.getDataLocal("actionsProfile");
    this.responsive = this.responsiveService.getResponsive(document.body.clientWidth);
    this.hide = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? true : false : false;
    this.showNavigation = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? true : false : false;
    this.collapse = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? true : false : false;
    this.fullItemsNav = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? false : true : true;

    this.token = this.SessionService.getToken();
    console.log('token => ', this.token)
    if (!this.token) this.router.navigateByUrl('/login')
  }

  ngOnInit(): void {
    this.login = this.SessionService.getToken() ? true : false;
    this.stateProfile = this.login ? "online" : "";
    this.commonService.share.subscribe((response) => {
      if (response) {
        if (response.modeDialog) {
          this.modeDialog = true;
        } else {
          this.modeDialog = false;
        }
      } else {
        this.modeDialog = false;
      }
    })
  }

  onResize(event: any): void {
    this.responsive = this.responsiveService.getResponsive(event.target.innerWidth);
    this.hide = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? true : false : false;
    this.showNavigation = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? true : false : false;
    this.collapse = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? true : false : false;
    this.fullItemsNav = this.responsive ? (this.responsive.tablet || this.responsive.desktop) ? false : true : true;
  }

  goToLogin(): void {
    this.SessionService.logOut();
    this.commonService.goTo("/login", null);
  }

  logOut(): void {
    this.SessionService.logOut()
    window.location.reload();
  }

  goToHome() {
    setTimeout(() => {
      this.SessionService.logOut();
      this.commonService.goTo("/login", null);
    }, 400);
  }

  goToComponent(itemNav: ID_Menu) {
    setTimeout(() => {
      this.showNavigation = document.body.clientWidth < 768 ? false : true;
      for (let a = 0; a < this.listMenu.length; a++) {
        const itemMenu: ID_Menu = this.listMenu[a];
        itemMenu.selected = false;
      }
      itemNav.selected = true;
      this.commonService.goTo("/" + itemNav.slug, null);
      this.commonService.shareData({resetSwitch: true})
    }, 400);
  }

  showMenu(data: any) {
    setTimeout(() => {
      this.showNavigation = data ? true : false;
    }, 400);
  }

  expandLateralMenuSearch(data: any) {
    setTimeout(() => {
      if (data.collapse) {
        this.collapse = true;
      } else {
        this.collapse = false;
      }
    }, 400);
  }

  contracLateralMenu() {
    setTimeout(() => {
      this.collapse = true;
      this.commonService.shareData({ forceCollapse: true });
    }, 400);
  }

  expandLateralMenu() {
    setTimeout(() => {
      this.collapse = false;
      this.commonService.shareData({ forceExpand: true });
    }, 400);
  }

}
