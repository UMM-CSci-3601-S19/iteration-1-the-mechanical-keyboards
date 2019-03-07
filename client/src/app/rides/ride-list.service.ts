import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Ride} from './ride';
import {environment} from '../../environments/environment';


@Injectable()
export class RideListService {
  readonly baseUrl: string = environment.API_URL + 'rides';
  private rideUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getRides(rideCompany?: string): Observable<Ride[]> {
    this.filterByCompany(rideCompany);
    return this.http.get<Ride[]>(this.rideUrl);
  }

  getRideById(id: string): Observable<Ride> {
    return this.http.get<Ride>(this.rideUrl + '/' + id);
  }

  /*
  //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
  //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
  getRidesByCompany(rideCompany?: string): Observable<Ride> {
      this.rideUrl = this.rideUrl + (!(rideCompany == null || rideCompany == "") ? "?company=" + rideCompany : "");
      console.log("The url is: " + this.rideUrl);
      return this.http.request(this.rideUrl).map(res => res.json());
  }
  */

  filterByCompany(rideCompany?: string): void {
    if (!(rideCompany == null || rideCompany === '')) {
      if (this.parameterPresent('company=')) {
        // there was a previous search by company that we need to clear
        this.removeParameter('company=');
      }
      if (this.rideUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.rideUrl += 'company=' + rideCompany + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.rideUrl += '?company=' + rideCompany + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('company=')) {
        let start = this.rideUrl.indexOf('company=');
        const end = this.rideUrl.indexOf('&', start);
        if (this.rideUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.rideUrl = this.rideUrl.substring(0, start) + this.rideUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.rideUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.rideUrl.indexOf(searchParam);
    let end = 0;
    if (this.rideUrl.indexOf('&') !== -1) {
      end = this.rideUrl.indexOf('&', start) + 1;
    } else {
      end = this.rideUrl.indexOf('&', start);
    }
    this.rideUrl = this.rideUrl.substring(0, start) + this.rideUrl.substring(end);
  }

  addNewRide(newRide: Ride): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new ride back
      // so we know how to find/access that ride again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new ride with the ride data as the body with specified headers.
    return this.http.post<string>(this.rideUrl + '/new', newRide, httpOptions);
  }
}
