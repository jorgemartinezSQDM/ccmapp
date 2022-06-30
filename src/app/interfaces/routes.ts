import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { CampaignsComponent } from '../components/campaigns/campaigns.component';
import { CustomersComponent } from '../components/customers/customers.component';
import { UsersComponent } from '../components/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: '/campaigns', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'campaigns', component: CampaignsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'users', component: UsersComponent },
];
