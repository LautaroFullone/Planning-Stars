import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
  selector: 'app-party-player-view',
  templateUrl: './party-player-view.component.html',
  styleUrls: ['./party-player-view.component.css']
})
export class PartyPlayerViewComponent implements OnInit {

  @Input() partyID: string;

  userStory: UserStory = {
    "id": 76,
    "tag": "16F9T",
    "name": "F_PartySwich component should validate if the party exists",
    "description": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. \nLorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. \nLorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. ",
    "storyPoints": null,
    "sprint": "8",
    "workArea": "FrontEnd",
    "storyWritter": "Lautaro Fullone",
    "fileLink": "http://givemenbastreams.com/nba/heat-live-stream?sport=basketball",
    "isActive": true
  }
  constructor() { }

  ngOnInit(): void {
  }

}
