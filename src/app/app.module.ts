import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/index/app.component';
import { CustomersComponent } from './components/customers/customers.component';
import { UsersComponent } from './components/users/users.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    UsersComponent,
    CampaignsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
