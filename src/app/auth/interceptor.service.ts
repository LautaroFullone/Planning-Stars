import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('token');
        let request = req;

        if (token) {
            request = request.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`
                }
            })
        }
        //console.log('REQUEST',request);

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {

                if (err.status === 401 || err.status === 403)
                    this.router.navigateByUrl('/login');

                return throwError(err);
            })
        );

    }

}
