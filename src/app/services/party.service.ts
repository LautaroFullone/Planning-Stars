import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Party } from '../models/party';

@Injectable({
    providedIn: 'root'
})
export class PartyService {

    private headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    private cardsList = [   
        { id: 1, value: '0' }, { id: 2, value: '½' }, { id: 3, value: '1' }, 
        { id: 4, value: '2' }, { id: 5, value: '3' }, { id: 6, value: '5' }, 
        { id: 7, value: '8' }, { id: 8, value: '13' }, { id: 9, value: '20' }, 
        { id: 10, value: '40' }, { id: 11, value: '\u221e' } 
    ];

    constructor(private http: HttpClient) { }

    getPartyByID(partyID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/party/${partyID}`, this.headers);
    }

    createParty(party: Party): Observable<any> {
        return this.http.post<any>(`${environment.apiURL}/party`, party, this.headers);
    }
 
    getPartyUserStories(partyID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/party/${partyID}/userstories`, this.headers);
    }

    getCardsList(): any{
        return this.cardsList;
    }
}
