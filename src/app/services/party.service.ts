import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Party } from '../models/party';
import { UserStory } from '../models/user-story';
import { Util_Constants } from '../util/util-constants';

@Injectable({
    providedIn: 'root'
})
export class PartyService {

    private headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }


    createParty(party: Party): Observable<any> {
        return this.http.post<any>(Util_Constants.API_URL + '/party', party, this.headers);
    }

    getPartyUserStories(partyID: string): Observable<any> {
        return this.http.get<any>(`${Util_Constants.API_URL}/party/${partyID}/userstories`, this.headers);
    }
    createUserStory(userstory: UserStory): Observable<any> {
        return this.http.post<any>(`${Util_Constants.API_URL}/userStory`, userstory, this.headers);
    }
    addUserStoryToParty(partyID: String, usID: String): Observable<any> {
        return this.http.put<any>(`${Util_Constants.API_URL}/party/${partyID}/userstory/${usID}`, this.headers);
    }
    deleteUserStory(usID: number): Observable<any> {
        return this.http.delete<any>(`${Util_Constants.API_URL}/userStory/${usID}`, this.headers);
    }

    getPartyPlayers(partyID: string): Observable<any> {
        return this.http.get<any>(`${Util_Constants.API_URL}/party/${partyID}/players`, this.headers);
    }

}
