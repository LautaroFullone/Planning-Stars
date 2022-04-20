import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthNotGuard implements CanActivate {
  
  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    let url: string = '/dashboard';

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {

    if (!this.authService.getToken()) 
      return true;
    
    this.router.navigateByUrl(url);

    return false;
  }
  
}
