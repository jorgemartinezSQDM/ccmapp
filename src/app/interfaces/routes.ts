import { CampaignsComponent } from '../components/campaigns/campaigns.component';
import { CustomersComponent } from '../components/customers/customers.component';
import {  Routes } from '@angular/router';
import { UsersComponent } from '../components/users/users.component';
import { LoginComponent } from '../components/login/login.component'

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'campaigns', component: CampaignsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'login', component: LoginComponent }
];