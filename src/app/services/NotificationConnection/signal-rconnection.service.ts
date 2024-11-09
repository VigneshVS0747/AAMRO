import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignalRconnectionService {

  private hubConnection: signalR.HubConnection;
  private messageReceived = new Subject<string[]>();
  private PushReceived = new Subject<string>();
  valuesReceived$ = this.messageReceived.asObservable();
  PushReceived$ = this.PushReceived.asObservable();
  


  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.SignalR+"notificationHub")
      .build();

    this.hubConnection.on('ReceiveMessage', (message: string[]) => {
      console.log('New received: ' + message);
      // Handle the received message
      this.messageReceived.next(message);
    });

    this.hubConnection.on('PushNotification', (Pushpopup: string) => {
      console.log('Push received: ' + Pushpopup);
      // Handle the received message
      this.PushReceived.next(Pushpopup);
    });

    this.hubConnection.start().catch(err => console.error(err));
  }
  public SendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }
}
