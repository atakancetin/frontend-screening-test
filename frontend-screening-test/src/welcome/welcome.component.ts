import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/services/websocket.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.sass']
})
export class WelcomeComponent implements OnInit {

  constructor(private websocket: WebSocketService) { }

  ngOnInit(): void {
    this.websocket.logoutSubject$.subscribe(() => {
      console.log("logout");
    })
  }

}
