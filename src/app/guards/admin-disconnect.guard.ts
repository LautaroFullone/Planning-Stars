import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { SocketWebService } from '../services/socket-web.service';

@Injectable({
    providedIn: 'root'
})
export class AdminDisconnectGuard implements CanDeactivate<unknown> {

    private notificationQuestion = 'Are you sure? As party Owner, if you decide to go out, the rest of player are going to be redirectd to dashboard page too.'

    constructor(private socketService: SocketWebService) { }

    canDeactivate(
        component: unknown,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        this.socketService.isUserPartyOwner();

        return this.socketService.userPartyOwner$.pipe(
            catchError(() => of(false)),   //of() method return an observable with parameter value 
            map(response => {

                if(response) {
                    let answer = confirm(this.notificationQuestion);
                    return answer;
                }
                else{
                    return true;
                }

            })
        );
    }

}
