import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
        { id: 1, value: '1' }, { id: 2, value: '2' }, { id: 3, value: '3' }, { id: 4, value: '5' }, { id: 5, value: '8' }, 
        { id: 6, value: '13' }, { id: 7, value: '21' }, { id: 8, value: '34' }, { id: 10, value: '89' }   
    ];

    constructor(private http: HttpClient) { }

    getPartyByID(partyID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/party/${partyID}`, this.headers);
    }

    createParty(party: Party): Observable<any> {
        return this.http.post<any>(`${environment.apiURL}/party`, party, this.headers);
    }

    getPartyPlayers(partyID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/party/${partyID}/players`, this.headers);
    }
 
    getPartyUserStories(partyID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/party/${partyID}/userstories`, this.headers);
    }

    getCardsList(){
        return this.cardsList;
    }
}
