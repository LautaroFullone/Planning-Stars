import { Component, OnInit, Renderer2 } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
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
                private toast: NotificationService) { }

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

            this.toast.successToast({
                title: "Vote Sent",
                description: "Your score was sent."
            })
        } else{
            this.toast.warningToast({
                title: "Invalid Action",
                description: "Please select a card before vote."
            })
        }
    }

}