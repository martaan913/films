import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MaterialModule} from "../../modules/material.module";
import {FormsModule} from "@angular/forms";
import {tap, Subscription} from "rxjs";
import {ChatMessage, ChatService} from "../../services/chat.service";
import * as console from "console";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MaterialModule,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnDestroy{
  name = '';
  chatService = inject(ChatService);
  messages: ChatMessage[] = [];
  msgToSend: string = '';
  messagesSubscription?: Subscription;
  greetingsSubscription?: Subscription;
  userConnected: boolean = false;

  connect(){
    this.chatService.connect().pipe(
      tap(ok => {
        if(ok){
          this.userConnected = true;
          this.listenEndpoints();
          this.chatService.sendName(this.name);
        }
      }),
    )
      .subscribe(ok =>{
      console.log("Connected");
    });
  }

  listenEndpoints(){
    this.messagesSubscription = this.chatService.listenMessages().subscribe(message =>{
      this.messages = [...this.messages,message];
    });
    this.greetingsSubscription =this.chatService.listenGreetings().subscribe(message =>{
      this.messages = [...this.messages,message];
    });
  }

  sendMessage(){
    this.chatService.sendMessage(this.msgToSend);
    this.msgToSend = '';
  }

  disconnect() {
    this.messages = [...this.messages, new ChatMessage('SERVER', `User ${this.name}, disconnected.`)];
    this.messagesSubscription?.unsubscribe();
    this.greetingsSubscription?.unsubscribe();
    this.chatService.disconnect();
    this.msgToSend = '';
    //this.messages = [];
    this.userConnected = false;
  }


  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
