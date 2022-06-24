import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Votation } from '../models/votation';

@Injectable({
    providedIn: 'root'
})
export class VotationService {

    private headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    createVotation(votation: Votation, userStoryID: number): Observable<any> {
        return this.http.put<any>(`${environment.apiURL}/userStory/${userStoryID}/votation`, votation, this.headers);
    }

    getPartyPlayers(userStoryID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/userStory/${userStoryID}/votations`, this.headers);
    }
}
