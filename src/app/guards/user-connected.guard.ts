import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { SocketWebService } from '../services/socket-web.service';

@Injectable({
    providedIn: 'root'
})
export class UserConnectedGuard implements CanActivate {

    constructor(private socketService: SocketWebService,
                private router: Router,
                private toast: NotificationService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        let partyID = route.params['id'];

        this.socketService.isUserPartyOwner();

        return this.socketService._userPartyOwner.pipe(  //it retrives undefined if user is not conected into party
            catchError(() => of(false)),   //of() method return an observable with parameter value 
            map(response => {
                if (response == undefined) { //if user is not connected into party
                    this.router.navigateByUrl('/dashboard');

                    this.toast.warningToast({
                        title: 'Joining Party Validation',
                        description: 'Please try to join from dashboard view'
                    })
                    return false
                }
                else {
                    return true;
                }
            })
        );
    }

}
