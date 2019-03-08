import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
})
export class AddRideComponent implements OnInit {

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

    ngOnInit()
    {
      //this.inputForm();
      const newRide: Ride = {
        _id: '',
        driver: '',
        notes: '',
        seatsAvailable: '',
        origin: '',
        destination: '',
        departureDate: '',
        departureTime: ''
      };

      data: {ride: newRide}
    }

  }

