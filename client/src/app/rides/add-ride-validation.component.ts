import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatFormField} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {AddRideComponent} from "./add-ride.component";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
})
export class AddRideValidationComponent implements OnInit {

  addRideForm: FormGroup;

  constructor(
    @Inject(MatFormField) public data: {ride: Ride}, private fb: FormBuilder) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_ride_validation_messages = {
    'driver': [
      {type: 'required', message: 'Driver name is required'},
      {type: 'minlength', message: 'Driver name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Driver name cannot be more than 70 characters long'},
      {type: 'pattern', message: 'Driver name must contain only letters'},
    ],

    'notes': [
      {type: 'minlength', message: 'Note must be at least 1 characters long'},
      {type: 'maxlength', message: 'Note cannot be more than 180 characters long'},
    ],

    'seatsAvailable': [
      {type: 'pattern', message: 'Seats Available must be a number'},
      {type: 'min', message: 'Seats Available must be at least 1'},
      {type: 'max', message: 'Seats Available may not be greater than 7'},
      {type: 'required', message: 'Seats Available is required'}
    ],

    'origin': [
      {type: 'required', message: 'Origin is required'},
      {type: 'minlength', message: 'Origin must be at least 2 characters long'},
      {type: 'maxlength', message: 'Origin cannot be more than 80 characters long'},
      {type: 'pattern', message: 'Origin must contain only numbers and letters'},
    ],

    'destination': [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'Destination must be at least 2 characters long'},
      {type: 'maxlength', message: 'Destination cannot be more than 80 characters long'},
      {type: 'pattern', message: 'Destination must contain only numbers and letters'},
    ],

    'departureDate': [
      {type: 'minlength', message: 'Departure Date must be at least 2 characters long'},
      {type: 'maxlength', message: 'Departure Date cannot be more than 20 characters long'},
      {type: 'pattern', message: 'Departure Date must contain only numbers and letters'},
    ],

    'departureTime': [
      {type: 'minlength', message: 'Departure time must be at least 2 characters long'},
      {type: 'maxlength', message: 'Departure time cannot be more than 10 characters long'},
      {type: 'pattern', message: 'Departure time must contain only numbers and letters'},
    ],
  };

  createForms() {

    // add ride form validations
    this.addRideForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      driver: new FormControl('driver', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(70),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      notes: new FormControl('notes', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(180),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'), //TODO: Figure out symbols
      ])),

      seatsAvailable: new FormControl('seatsAvailable', Validators.compose([
        Validators.pattern('^[0-9]+[0-9]?'),
        Validators.min(1),
        Validators.max(7),
        Validators.required
      ])),

      origin: new FormControl('origin', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(80),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      destination: new FormControl('destination', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(80),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      departureDate: new FormControl('departureDate', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      departureTime: new FormControl('departureTime', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

    })

  }

  ngOnInit() {
    this.createForms();
  }

}
