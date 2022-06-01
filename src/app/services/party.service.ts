import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Party } from '../models/party';
import { UserStory } from '../models/user-story';

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
    
    createUserStory(userstory: UserStory): Observable<any> {
        return this.http.post<any>(`${environment.apiURL}/userStory`, userstory, this.headers);
    }

    addUserStoryToParty(partyID: String, usID: String): Observable<any> {
        return this.http.put<any>(`${environment.apiURL}/party/${partyID}/userstory/${usID}`, this.headers);
    }

    deleteUserStory(usID: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiURL}/userStory/${usID}`, this.headers);
    }

    updateUserStory(usID: number, newUS: UserStory): Observable<any> {
        return this.http.put<any>(`${environment.apiURL}/userStory/${usID}`, newUS, this.headers);
    }
}
