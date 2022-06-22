import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/index/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomersComponent } from './components/customers/customers.component';
import { UsersComponent } from './components/users/users.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './components/login/login.component';
import { NgwWowModule } from 'ngx-wow';

@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    UsersComponent,
    CampaignsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgwWowModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
