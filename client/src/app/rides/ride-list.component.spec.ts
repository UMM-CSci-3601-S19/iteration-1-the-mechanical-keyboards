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
          notes: 'These are Chris\'s ride notes',
          seatsAvailable: 3,
          origin: 'UMM',
          destination: 'Willie\'s',
          departureDate: '3/6/2019',
          departureTime: '10:00:00'
        },
        {
          _id: 'dennis_id',
          driver: 'Dennis',
          notes: 'These are Dennis\'s ride notes',
          seatsAvailable: 3,
          origin: 'Caribou Coffee',
          destination: 'Minneapolis, MN',
          departureDate: '8/15/2018',
          departureTime: '11:30:00'
        },
        {
          _id: 'agatha_id',
          driver: 'Agatha',
          notes: 'These are Agatha\'s ride notes',
          seatsAvailable: 6,
          origin: 'UMM',
          destination: 'Fergus Falls, MN',
          departureDate: '3/30/2019',
          departureTime: '16:30:00'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
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

  //departureDate, _id, notes
  //Done: origin, destination, departureTime,
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
    expect(rideList.rides.filter((ride: Ride) => ride.seatsAvailable === 3).length).toBe(2);
  });

  it('has two rides with origin \'UMM\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.origin === 'UMM').length).toBe(2);
  });

  it('doesn\'t contain a ride with origin \'The Circus\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.origin === 'The Circus')).toBe(false);
  });

  it('has one ride with destination \'Fergus Falls, MN\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.destination === 'Fergus Falls, MN').length).toBe(1);
  });

  it('doesn\'t have a ride with destination \'Wadena, MN\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Wadena, MN')).toBe(false);
  });

  it('has one ride with departure time \'16:30:00\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '16:30:00').length).toBe(1);
  });

  it('doesn\'t have a ride with departure time \'17:30:00\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.departureTime === '17:30:00')).toBe(false);
  });

  it('has one ride with departure date \'3/30/2019\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.departureDate === '3/30/2019').length).toBe(1);
  });

  it('doesn\'t have a ride with departure date \'11/30/2019\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.departureDate === '11/30/2019')).toBe(false);
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
