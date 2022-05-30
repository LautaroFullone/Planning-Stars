import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PartyService } from '../services/party.service';

@Injectable({
    providedIn: 'root'
})
export class PartyExistsGuard implements CanActivate {

    constructor(private partyService: PartyService,
                private router: Router,
                private toast: NgToastService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        console.log('state', state);
        console.log('state.url', state.url);
        console.log('route', route);
        console.log('route.params', route.params['id']);

        let partyID = route.params['id'];
    
        return this.partyService.getPartyByID(partyID).pipe(
            catchError( () => of(false)),               //of() method return an observable with parameter value 
            map(response => {
                console.log('PartyExistsGuard', response);
                if(!response){
                    this.router.navigateByUrl('/not-found');

                    this.toast.error({
                        detail: "PARTY NOT FOUND",
                        summary: `The party #${partyID} was not found`,
                        position: 'br', duration: 6000
                    })

                    return false;
                }
                return true;
            })
        );
    }


}
