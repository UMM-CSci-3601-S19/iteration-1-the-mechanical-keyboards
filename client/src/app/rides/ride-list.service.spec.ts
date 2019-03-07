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
      name: 'Chris',
      age: 25,
      company: 'UMM',
      email: 'chris@this.that'
    },
    {
      _id: 'pat_id',
      name: 'Pat',
      age: 37,
      company: 'IBM',
      email: 'pat@something.com'
    },
    {
      _id: 'jamie_id',
      name: 'Jamie',
      age: 37,
      company: 'Frogs, Inc.',
      email: 'jamie@frogs.com'
    }
  ];
  const mRides: Ride[] = testRides.filter(ride =>
    ride.company.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the rideListService to meaningfully test company filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let rideListService: RideListService;
  let currentlyImpossibleToGenerateSearchRideUrl: string;

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

  it('getRides() calls api/rides', () => {
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

  it('getRides(rideCompany) adds appropriate param string to called URL', () => {
    rideListService.getRides('m').subscribe(
      rides => expect(rides).toEqual(mRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl + '?company=m&');
    expect(req.request.method).toEqual('GET');
    req.flush(mRides);
  });

  it('filterByCompany(rideCompany) deals appropriately with a URL that already had a company', () => {
    currentlyImpossibleToGenerateSearchRideUrl = rideListService.baseUrl + '?company=f&something=k&';
    rideListService['rideUrl'] = currentlyImpossibleToGenerateSearchRideUrl;
    rideListService.filterByCompany('m');
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '?something=k&company=m&');
  });

  it('filterByCompany(rideCompany) deals appropriately with a URL that already had some filtering, but no company', () => {
    currentlyImpossibleToGenerateSearchRideUrl = rideListService.baseUrl + '?something=k&';
    rideListService['rideUrl'] = currentlyImpossibleToGenerateSearchRideUrl;
    rideListService.filterByCompany('m');
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '?something=k&company=m&');
  });

  it('filterByCompany(rideCompany) deals appropriately with a URL has the keyword company, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchRideUrl = rideListService.baseUrl + '?company=&';
    rideListService['rideUrl'] = currentlyImpossibleToGenerateSearchRideUrl;
    rideListService.filterByCompany('');
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '');
  });

  it('getRideById() calls api/rides/id', () => {
    const targetRide: Ride = testRides[1];
    const targetId: string = targetRide._id;
    rideListService.getRideById(targetId).subscribe(
      ride => expect(ride).toBe(targetRide)
    );

    const expectedUrl: string = rideListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetRide);
  });

  it('adding a ride calls api/rides/new', () => {
    const jesse_id = 'jesse_id';
    const newRide: Ride = {
      _id: '',
      name: 'Jesse',
      age: 72,
      company: 'Smithsonian',
      email: 'jesse@stuff.com'
    };

    rideListService.addNewRide(newRide).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = rideListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });
});
