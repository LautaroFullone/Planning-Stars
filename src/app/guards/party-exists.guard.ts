import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { PartyService } from '../services/party.service';

@Injectable({
    providedIn: 'root'
})
export class PartyExistsGuard implements CanActivate {

    constructor(private partyService: PartyService,
                private router: Router,
                private toast: NotificationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        let partyID = route.params['id'];
    
        return this.partyService.getPartyByID(partyID).pipe(
            catchError( () => of(false)),   //of() method return an observable with parameter value 
            map(response => {
                if(!response){
                    this.router.navigateByUrl('/not-found');

                    this.toast.errorToast({
                        title: 'Party Not Found',
                        description: `The party #${partyID} was not found`
                    })
                    return false;
                }
                return true;
            })
        );
    }

}
