import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private isNavBarActive: BehaviorSubject<boolean>;
  private areNavBarOptionsActive: BehaviorSubject<boolean>;

  constructor() { 
    this.isNavBarActive = new BehaviorSubject(false);
    this.areNavBarOptionsActive = new BehaviorSubject(false);
  }

  setShowNarBar(showComponent: boolean, showOptions: boolean = false): void {
    this.isNavBarActive.next(showComponent);
    this.areNavBarOptionsActive.next(showOptions);
  }
  getShowNavBar(): Observable<boolean> {
    return this.isNavBarActive.asObservable();
  }
  getShowNavBarOptions(): Observable<boolean> {
    return this.areNavBarOptionsActive.asObservable();
  }
}
