import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { WebSocketService } from 'src/services/websocket.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.sass']
})
export class WelcomeComponent implements OnInit {
  message: string
  constructor(private socket: WebSocketService, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getWelcomeMssage();
    this.socket.logoutSubject$.subscribe(() => {      
      this.logoutUser();      
    });
  }

  getWelcomeMssage(){
    this.api.getWelcomeMessage().subscribe(res=>{
      this.message = res.data;
    },
    err =>{
      console.error(err);
    }
    );
  }

  logoutUser(){
    localStorage.removeItem('token');
    this.socket.removeToken();
    this.socket.close();
    this.router.navigateByUrl("/login");        
  }


}
