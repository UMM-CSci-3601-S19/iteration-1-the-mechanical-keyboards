import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
})

export class RideListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public rides: Ride[];
  public filteredRides: Ride[];

  // These are the target values used in searching.
  // We should rename them to make that clearer.
  public rideName: string;
  public rideAge: number;
  public rideCompany: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public dialog: MatDialog) {

  }

  isHighlighted(ride: Ride): boolean {
    return ride._id['$oid'] === this.highlightedID;
  }

/*
  public filterRides(searchName: string, searchAge: number): Ride[] {

    this.filteredRides = this.rides;

    // Filter by name
    if (searchName != null) {
      searchName = searchName.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchName || ride.name.toLowerCase().indexOf(searchName) !== -1;
      });
    }

    // Filter by age
    if (searchAge != null) {
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchAge || ride.age == searchAge;
      });
    }

    return this.filteredRides;
  }

  /**
   * Starts an asynchronous operation to update the rides list
   *
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

  loadService(): void {
    this.rideListService.getRides(this.rideCompany).subscribe(
      rides => {
        this.rides = rides;
        this.filteredRides = this.rides;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshRides();
    this.loadService();
  }
}
