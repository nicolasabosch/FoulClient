
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'foulClient';

  private socket: WebSocket;
  private connection: Observable<any>;
  public algo: any;
  public ver:string="";
  private speechSynthesis = window.speechSynthesis;
  public  record:any;
  public  recordList:any[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.http.get<any>('http://admin.foul.com.ar/api/Match').subscribe(data => {
      this.recordList = data;
  })

    this.algo={
      "MatchID": 3,
      "MatchDate": "2023-11-04T00:00:00",
      "ZoneID": 1,
      "MatchStatusID": "NotStarted",
      "MatchStatusName": "No Comenzado",
      "ZoneName": "Norte",
      "HomeTeamID": 2,
      "HomeTeamName": "Galicia",
      "AwayTeamName": "Buchardo",
      "AwayTeamID": 1,
      "HomeGoals": 0,
      "AwayGoals": 0,
      "localFileID": "a1d07072-83dc-4da5-8a24-d9487f9642a3",
      "visitanteFileID": "b744f776-5dcf-4a61-a489-6a519908995c",
      "HomeTeam": {
        "TeamID": 2,
        "TeamName": "Galicia"
      },
      "AwayTeam": {
        "TeamID": 1,
        "TeamName": "Buchardo"
      },
      "local": "Galicia",
      "visitante": "Buchardo",
      "localJugadores": [
        {
          "Nombre": "Lionel Messi",
          "Camiseta": 10,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Kun Aguero",
          "Camiseta": 9,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Diego Maradona",
          "Camiseta": 8,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Harry Styles",
          "Camiseta": 7,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Christian Martin",
          "Camiseta": 6,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "El Zorro",
          "Camiseta": 5,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Charly Garcia",
          "Camiseta": 4,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Leon Gieco",
          "Camiseta": 3,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Gustavo Cerati",
          "Camiseta": 2,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Angel Carranza",
          "Camiseta": 1,
          "Puntos": 0,
          "Faltas": 0
        }
      ],
      "visitanteJugadores": [
        {
          "Nombre": "Nicolás Abosch",
          "Camiseta": 1,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Rodrigo Diaz",
          "Camiseta": 2,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Matias Fernandes",
          "Camiseta": 3,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Maximiliano Tag",
          "Camiseta": 4,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Agustín Baudot",
          "Camiseta": 5,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Marco Diaz",
          "Camiseta": 6,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Martín Verlatsky",
          "Camiseta": 7,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Ignacio Bertoni",
          "Camiseta": 8,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Nicolás Chab",
          "Camiseta": 9,
          "Puntos": 0,
          "Faltas": 0
        },
        {
          "Nombre": "Noel Teller",
          "Camiseta": 10,
          "Puntos": 0,
          "Faltas": 0
        }
      ],
      
      "puntosLocal": 20,
      "puntosVisitante": 9,
      "tiempoRestante": "08:34",
      "text": "Falta",
      "currentMatchStatus": "Jugando"
    };





    this.socket = new WebSocket('ws://172.174.204.46:8000');
    this.connection = this.connect()
    this.connection.subscribe(
      (message) => {
        alert("msg");
        var msjJSON =  JSON.parse(message.replace(/'/g, '"'));
        this.record= msjJSON;
        if (this.record.text)
        {
          
          var msg = new SpeechSynthesisUtterance();
          msg.text =this.record.text;
          speechSynthesis.speak(msg);
          
        }
      },
      (error) => {
        console.error(error);
      }
    );

   
  }

  
  public connect(): Observable<any> {
    return new Observable(observer => {
      this.socket.onmessage = (event) => 
      {
        if (!this.record)
        this.record = {};

        var msjJSON =  JSON.parse(event.data.replace(/'/g, '"'));
        
         if (msjJSON.MatchID)
         {
              this.record= msjJSON;
         }   
         else
         {
          this.record.tiempoRestante = msjJSON.tiempoRestante;
          this.record.text="";
         }

        if (this.record.text)
        {
          
          
          var msg = new SpeechSynthesisUtterance();
          msg.text =this.record.text;
          speechSynthesis.cancel();
          speechSynthesis.speak(msg);
          msg.text ="";
          
        }
        
        }
        ;
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  public sendMessage(message: string): void {
    //this.socket.send(message);
  }

}
