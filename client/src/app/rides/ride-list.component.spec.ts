import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideListComponent} from './ride-list.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Ride list', () => {

  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>
  };

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.of([
        {
          _id: 'chris_id',
          driver: 'Chris',
          seats_available: 3,
          start_location: 'UMM',
          end_location: 'Willie\'s',
          departure_date: '3/6/2019',
          departure_time: '10:00:00'
        },
        {
          _id: 'dennis_id',
          driver: 'Dennis',
          seats_available: 3,
          start_location: 'Caribou Coffee',
          end_location: 'Minneapolis, MN',
          departure_date: '8/15/2018',
          departure_time: '11:30:00'
        },
        {
          _id: 'agatha_id',
          driver: 'Agatha',
          seats_available: 6,
          start_location: 'UMM',
          end_location: 'Fergus Falls, MN',
          departure_date: '3/30/2019',
          departure_time: '16:30:00'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [RideListComponent],
      // providers:    [ RideListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the rides', () => {
    expect(rideList.rides.length).toBe(3);
  });

  it('contains a ride with driver \'Chris\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.driver === 'Chris')).toBe(true);
  });

  it('contain a ride with driver \'Dennis\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.driver === 'Dennis')).toBe(true);
  });

  it('doesn\'t contain a ride with driver \'Dilbert\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.driver === 'Dilbert')).toBe(false);
  });

  it('has two rides that have 3 available seats', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.seats_available === 3).length).toBe(2);
  });
});

describe('Misbehaving Ride List', () => {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>
  };

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a RideListService', () => {
    // Since the observer throws an error, we don't expect rides to be defined.
    expect(rideList.rides).toBeUndefined();
  });
});
