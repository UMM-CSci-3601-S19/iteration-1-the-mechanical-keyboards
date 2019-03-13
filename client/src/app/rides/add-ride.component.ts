import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideListComponent} from "./ride-list.component";
import {RideListService} from "./ride-list.service";
import {Observable} from "rxjs/Observable";
import {AddRideValidationComponent} from "./add-ride-validation.component";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
  styleUrls: ['./add-ride.component.scss'],
  providers: [ RideListComponent],
})

export class AddRideComponent implements OnInit {

  public rides: Ride[];

  private highlightedID: string = '';

  public rideDriver: string;
  public rideNotes: string;
  public rideSeats: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;

  public data: string[];

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService) {

  }

  addRide(): void {
    const newRide: Ride = {_id: '', driver: this.rideDriver, notes: this.rideNotes, seatsAvailable: Number(this.rideSeats),
      origin: this.rideOrigin, destination: this.rideDestination, departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime};

    // const data = {ride: newRide};

    console.log(newRide);

    if (newRide != null) {
      this.rideListService.addNewRide(newRide).subscribe(
        result => {
          this.highlightedID = result;
          this.refreshRides();
        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error adding the ride.');
          console.log('The newRide or dialogResult was ' + newRide);
          console.log('The error was ' + JSON.stringify(err));
        });
    }
  };

  refreshRides(): Observable<Ride[]> {
    // Get Rides returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)
    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        this.rides = rides;
      },
      err => {
        console.log(err);
      });
    return rides;
  }


    ngOnInit() {
      this.refreshRides();
    }

  }

