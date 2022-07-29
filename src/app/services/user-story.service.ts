import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserStory } from '../models/user-story';

@Injectable({
    providedIn: 'root'
})
export class UserStoryService {

    private headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    private selectedUserStory: BehaviorSubject<UserStory>;

    constructor(private http: HttpClient) {
        this.selectedUserStory = new BehaviorSubject(undefined);
    }

    setSelectedUS(userStory: UserStory): void {
        this.selectedUserStory.next(userStory);
    }

    getSelectedUS(): Observable<UserStory> {
        return this.selectedUserStory.asObservable();
    }

    createUserStory(userstory: UserStory): Observable<any> {
        return this.http.post<any>(`${environment.apiURL}/userStory`, userstory, this.headers);
    }

    addUserStoryToParty(partyID: string, usID: string): Observable<any> {
        return this.http.put<any>(`${environment.apiURL}/party/${partyID}/userstory/${usID}`, this.headers);
    }

    deleteUserStory(usID: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiURL}/userStory/${usID}`, this.headers);
    }

    updateUserStory(usID: number, newUS: UserStory): Observable<any> {
        return this.http.put<any>(`${environment.apiURL}/userStory/${usID}`, newUS, this.headers);
    }

    //TODO: this method in api
    saveFinalVotationResult(usID: number, storyPoints: number) {
        return this.http.post<any>(`${environment.apiURL}/userStory/${usID}/planning-result`, storyPoints, this.headers);
    }
}
