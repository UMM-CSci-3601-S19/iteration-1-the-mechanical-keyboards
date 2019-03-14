// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RideListComponent} from "./rides/ride-list.component";
import {AddRideComponent} from "./rides/add-ride.component";

// Route Configuration
export const routes: Routes = [
  {path: '', component: RideListComponent},
  {path: 'rides', component: RideListComponent},
  {path: 'addride', component: AddRideComponent}

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
