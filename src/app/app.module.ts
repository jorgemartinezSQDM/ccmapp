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
import { AvatarComponent } from './components/elemens-ui/avatar/avatar.component';
import { InputSearchComponent } from './components/elemens-ui/input-search/input-search.component';
import { ButtonComponent } from './components/elemens-ui/button/button.component';
import { InputTextComponent } from './components/elemens-ui/input-text/input-text.component';
import { SpinnerComponent } from './components/elemens-ui/spinner/spinner.component';
import { FeedbackComponent } from './components/elemens-ui/feedback/feedback.component';
import { SelectOptionComponent } from './components/elemens-ui/select-option/select-option.component';
import { CkeckboxComponent } from './components/elemens-ui/ckeckbox/ckeckbox.component';
import { CampaignsTableComponent } from './components/tables/campaigns-table/campaigns-table.component';
import { TextTableComponent } from './components/elemens-ui/table/text-table/text-table.component';
import { DialogComponent } from './components/elemens-ui/dialog/dialog.component';
import { CustomersTableComponent } from './components/tables/customers-table/customers-table.component';
import { UsersTableComponent } from './components/tables/users-table/users-table.component';
import { FrequencyComponent } from './components/frequency/frequency.component';
import { FrequencyTableComponent } from './components/tables/frequency-table/frequency-table.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    UsersComponent,
    CampaignsComponent,
    LoginComponent,
    AvatarComponent,
    InputSearchComponent,
    ButtonComponent,
    InputTextComponent,
    SpinnerComponent,
    FeedbackComponent,
    SelectOptionComponent,
    CkeckboxComponent,
    CampaignsTableComponent,
    TextTableComponent,
    DialogComponent,
    CustomersTableComponent,
    UsersTableComponent,
    FrequencyComponent,
    FrequencyTableComponent,
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
