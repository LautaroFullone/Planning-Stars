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

    getUserStoryVotations(userStoryID: number): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/userStory/${userStoryID}/votations`, this.headers);
    }

    //TODO: this method in api
    saveFinalVotationResult(userStoryID: number, storyPoints: number) {
        return this.http.post<any>(`${environment.apiURL}/userStory/${userStoryID}/planning-result`, storyPoints, this.headers);
    }

    getPlanningDetails(userStoryID: number, numberOfConnectedUsers: number) {
        return this.http.get<any>(`${environment.apiURL}/userStory/${userStoryID}/planning-details/${numberOfConnectedUsers}`, this.headers);
    }
}
