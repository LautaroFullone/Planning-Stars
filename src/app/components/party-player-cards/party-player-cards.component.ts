import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-player-cards',
    templateUrl: './party-player-cards.component.html',
    styleUrls: ['../party-player-view/party-player-view.component.css',
                './party-player-cards.component.css']
})
export class PartyPlayerCardsComponent implements OnInit {

    cardSelected: HTMLElement;
    cardsList: Array<any>;

    constructor(private partyService: PartyService,
                private render: Renderer2,
                private toast: NgToastService) { }

    ngOnInit(): void {
        this.cardsList = this.partyService.getCardsList();
    }

    handleClickCard(card: any){
        if(this.cardSelected)
            this.render.removeClass(this.cardSelected, "active");

        this.cardSelected = document.getElementById(`card-${card.id}`);
       
        this.render.addClass(this.cardSelected, "active");
    }

    handleVote(){
        if(this.cardSelected){ 
            let cardValue = this.cardSelected.innerHTML;
            console.log('cardValue', cardValue);
            this.toast.success({
                detail: "VOTE SENT",
                summary: `Your score was sent`,
                position: 'br', duration: 6000
            })
        } else{
            this.toast.info({
                detail: "INVALID ACTION",
                summary: `Please select a card before vote`,
                position: 'br', duration: 6000
            })
        }
    }

}