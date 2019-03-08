// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {RideListComponent} from "./rides/ride-list.component";
import {AddRideComponent} from "./rides/add-ride.component";

// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'rides', component: RideListComponent},
  {path: 'addride', component: AddRideComponent}

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
