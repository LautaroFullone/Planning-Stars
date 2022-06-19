import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUser } from '../models/login-user';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private token = null;
    private user: User;

    private headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient,
                private router: Router) { }

    login(userLoginInfo: LoginUser): Observable<any> {
        let observable = this.http.post(`${environment.apiURL}/user/login`, userLoginInfo, this.headers);

        observable.subscribe({
            next: (response) => { 
                this.token = response['token'];
                this.user = response['userDetails'];
                
                sessionStorage.setItem('token', this.token);
                sessionStorage.setItem('user-id', this.user.id.toString());
            }
        })
        return observable;
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this.http.post(`${environment.apiURL}/user/register`, { name, email, password }, this.headers);
    }

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user-id');

        this.token = null;
        this.user = null;

        this.router.navigateByUrl("/login");
    }

    getUserById(userID: string): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/user/${userID}`, this.headers);
    }

    getUser(): Observable<any> {
        if (this.user)
            return new BehaviorSubject(this.user).asObservable();
        else
            return this.getUserById(sessionStorage.getItem('user-id'));
    }

    renameUserAccount(userID: string, user: User): Observable<any> {
        return this.http.put<any>(`${environment.apiURL}/user/${userID}`, user, this.headers);
    }

    getToken() {
        this.token = sessionStorage.getItem('token');
        return this.token;
    }

    setUserName(username: string){
        if(this.user)
            this.user.name = username;
    }

}