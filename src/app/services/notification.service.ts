import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    
    private secondsDuration = 6;
    private positionToast = 'br';

    constructor(private toast: NgToastService) { }

    successToast( data: {title: string, description: string } ) {
        this.toast.success({
            detail: data.title,
            summary: data.description,
            position: this.positionToast, 
            duration: this.secondsDuration * 1000
        })
    }

    warningToast(data: { title: string, description: string }) {
        this.toast.warning({
            detail: data.title,
            summary: data.description,
            position: this.positionToast,
            duration: this.secondsDuration * 1000
        })
    }

    errorToast(data: { title: string, description: string }) {
        this.toast.error({
            detail: data.title,
            summary: data.description,
            position: this.positionToast,
            duration: this.secondsDuration * 1000
        })
    }

    infoToast(data: { title: string, description: string }) {
        this.toast.info({
            detail: data.title,
            summary: data.description,
            position: this.positionToast,
            duration: this.secondsDuration * 1000
        })
    }
}
