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

  public addRideForm: FormGroup;

  public rideDriver: string;
  public rideNotes: string;
  public rideSeats: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, private fb: FormBuilder) {

  }

  add_ride_validation_messages = {
    'driver': [
      {type: 'required', message: 'Please enter your name'},
      {type: 'minlength', message: 'Please enter your full name'},
      {type: 'pattern', message: 'Please enter a valid name'}
    ],

    'seatsAvailable': [
      {type: 'required', message: 'Please specify how many seats you\'re offering'},
      {type: 'min', message: 'Please offer at least 1 seat'}
    ],

    'origin': [
      {type: 'required', message: 'Origin is required'}
    ],

    'destination': [
      {type: 'required', message: 'Destination is required'}
    ]
  };

  addRide(): void {
    const newRide: Ride = {_id: '',
      driver: this.rideDriver,
      notes: this.rideNotes,
      seatsAvailable: Number(this.rideSeats),
      origin: this.rideOrigin,
      destination: this.rideDestination,
      departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime};

    console.log(newRide);

    if (newRide != null) {
      this.rideListService.addNewRide(newRide).subscribe(
        result => {
          this.highlightedID = result;
        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error adding the ride.');
          console.log('The newRide or dialogResult was ' + newRide);
          console.log('The error was ' + JSON.stringify(err));
        });
    }
  };

  createForm() {
    this.addRideForm = this.fb.group({
      driver: new FormControl('driver', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),

      seatsAvailable: new FormControl('seatsAvailable', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),

      origin: new FormControl('origin', Validators.compose([
        Validators.required
      ])),

      destination: new FormControl('destination', Validators.compose([
        Validators.required
      ])),

      departureDate: new FormControl('departureDate'),

      departureTime: new FormControl('departureTime'),

      notes: new FormControl('notes')
    })
  }

  ngOnInit() {
    this.createForm();
  }

  }

