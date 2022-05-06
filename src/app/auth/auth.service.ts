import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginUser } from '../models/login-user';
import { User } from '../models/user';
import { Util_Constants } from '../util/util-constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    token = null;
    user: User;

    redirectUrl: string = '';

    constructor(private http: HttpClient,
        private router: Router) { }

    login(userLoginInfo: LoginUser): Observable<any> {

        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const observable = this.http.post(Util_Constants.API_URL + 'user/login ', userLoginInfo, headers);

        observable.subscribe((response) => {
            this.token = response['token'];
            this.user = response['userDetails'];

            sessionStorage.setItem('token', this.token);
            sessionStorage.setItem('username', this.user.name);

            this.redirectUrl = '/dashboard';

        },
            (error) => {
                console.log('LOGIN ERROR: ' + error);
            });

        return observable;
    }

    register(name: String, email: String, password: String): Observable<any> {

        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const observable = this.http.post(Util_Constants.API_URL + 'user/register ', { name, email, password }, headers);
        return observable;
    }

    logOut() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        this.token = null;
        this.user = null;

        this.router.navigateByUrl("/login");
    }

    getToken() {
        this.token = sessionStorage.getItem('token');
        return this.token;
    }

    getUser() {
        if (this.user)
            return this.user;
        else {
            //TODO-> LLAMADA A GET BY ID
            let calluser = new User();
            calluser.name = sessionStorage.getItem('username');

            this.user = calluser;
            return calluser;
        }
    }

    getRedirectUrl() {
        return this.redirectUrl;
    }


}