import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ViewService {

    private isNavBarActive: BehaviorSubject<boolean>;
    private showLeavePartyButton: BehaviorSubject<boolean>;
    private areNavBarOptionsActive: BehaviorSubject<boolean>;

    constructor() {
        this.isNavBarActive = new BehaviorSubject(false);
        this.showLeavePartyButton = new BehaviorSubject(false);
        this.areNavBarOptionsActive = new BehaviorSubject(false);
    }

    setShowNarBar(showComponent: boolean, showOptions: boolean = false, 
                  showLeaveParty: boolean = false): void {
        this.isNavBarActive.next(showComponent);
        this.showLeavePartyButton.next(showLeaveParty)
        this.areNavBarOptionsActive.next(showOptions);
    }

    getShowNavBar(): Observable<boolean> {
        return this.isNavBarActive.asObservable();
    }
    getShowNavBarOptions(): Observable<boolean> {
        return this.areNavBarOptionsActive.asObservable();
    }
    getShowLeavePartyButton(): Observable<boolean> {
        return this.showLeavePartyButton.asObservable();
    }
}
