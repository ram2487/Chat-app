import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { Routes, RouterModule } from '@angular/router';
import { ChatRoutingModule } from './chat-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'node_modules/ngx-toastr/'


@NgModule({
  declarations: [ChatBoxComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ]
})
export class ChatModule { }
