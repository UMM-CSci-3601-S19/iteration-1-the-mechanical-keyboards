import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Ride} from './ride';
import {RideListService} from './ride-list.service';

describe('Ride list service: ', () => {
  // A small collection of test rides
  const testRides: Ride[] = [
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
      seats_available: 1,
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
  ];

  let rideListService: RideListService;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    rideListService = new RideListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getRides() calls api/rides and returns appropriate objects', () => {
    // Assert that the rides we get from this call to getRides()
    // should be our set of test rides. Because we're subscribing
    // to the result of getRides(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testRides) a few lines
    // down.
    rideListService.getRides().subscribe(
      rides => expect(rides).toBe(testRides)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(rideListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testRides);
  });
});
