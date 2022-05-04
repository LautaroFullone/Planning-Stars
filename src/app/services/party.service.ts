import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Party } from '../models/party';
import { Util_Constants } from '../util/util-constants';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  constructor(private http: HttpClient) { }


  createParty(party: Party): Observable<any> {

    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application / json'
      })
    };

    return this.http.post<Party>(Util_Constants.API_URL+'/party', party, headers);
  }

}
