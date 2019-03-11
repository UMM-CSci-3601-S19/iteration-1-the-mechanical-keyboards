import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideListComponent} from "./ride-list.component";
import {RideListService} from "./ride-list.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
  styleUrls: ['./add-ride.component.css'],
  providers: [ RideListComponent ]
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

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService) {

  }

  addRide(): void {
    const newRide: Ride = {_id: '', driver: this.rideDriver, notes: this.rideNotes, seatsAvailable: Number(this.rideSeats),
      origin: this.rideOrigin, destination: this.rideDestination, departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime};
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

  addRideForm: FormGroup;

 // constructor(
  //  @Inject(MAT_DIALOG_DATA) public data: {ride: Ride}, private fb: FormBuilder){

 // }

/*
  inputForm() {

    // add user form validations
    this.addRideForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new FormControl('name', Validators.compose([
        NameValidator.validName,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      age: new FormControl('age', Validators.compose([
        Validators.pattern('^[0-9]+[0-9]?'),
        Validators.min(15),
        Validators.max(200),
        Validators.required
      ])),

      // We don't care much about what is in the company field, so we just add it here as part of the form
      // without any particular validation.
      company: new FormControl('company'),

      // We don't need a special validator just for our app here, but there is a default one for email.
      email: new FormControl('email', Validators.email)
    })
  }
*/
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

