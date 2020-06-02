import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies'
import { SocketService } from "../../services/socket-service.service";


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]

})
export class ChatBoxComponent implements OnInit {
  @ViewChild('scrollMe', { read: ElementRef }) 
  
  public scrollMe: ElementRef;

  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public disconnectedSocket: boolean;
  public userList: any = [];

  public scrollToChatTop:boolean= false;

 
  public previousChatList: any = [];
  public messageText: any; 
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;

  constructor(
    public appService: AppService,
    public socketService: SocketService,
    public router: Router,
    public toaster: ToastrService
  ) {
    this.receiverId = Cookie.get('receiverId');

    this.receiverName = Cookie.get('receiverName');

  }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();

    this.checkUserStatus();
    this.verifyUserConf();
    this.getOnlineUsersList();

  }

  public checkUserStatus(): boolean {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '') {

      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }

  verifyUserConf() {
    this.socketService.verifyUser()
      .subscribe((data) => {
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
        this.getOnlineUsersList();

      });

  }

  public getOnlineUsersList :any =()=>{

    this.socketService.onlineUserList()
      .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);          

        }
        
        console.log(this.userList);

      }); // end online-user-list
    }

 // chat related methods 


 public getPreviousChatWithAUser :any = ()=>{
  let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
  
  this.socketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
  .subscribe((apiResponse) => {

    console.log(apiResponse);

    if (apiResponse.status == 200) {

      this.messageList = apiResponse.data.concat(previousData);

    } else {

      this.messageList = previousData;
      this.toaster.warning('No Messages available')

     

    }

    this.loadingPreviousChat = false;

  }, (err) => {

    this.toaster.error('some error occured')


  });

}// end get previous chat with any user


public loadEarlierPageOfChat: any = () => {

  this.loadingPreviousChat = true;

  this.pageValue++;
  this.scrollToChatTop = true;

  this.getPreviousChatWithAUser() 

} // end loadPreviousChat

public userSelectedToChat: any = (id, name) => {

  console.log("setting user as active") 

  // setting that user to chatting true   
  this.userList.map((user)=>{
      if(user.userId==id){
        user.chatting=true;
      }
      else{
        user.chatting = false;
      }
  })

  Cookie.set('receiverId', id);

  Cookie.set('receiverName', name);


  this.receiverName = name;

  this.receiverId = id;

  this.messageList = [];

  this.pageValue = 0;

  let chatDetails = {
    userId: this.userInfo.userId,
    senderId: id
  }


  this.socketService.markChatAsSeen(chatDetails);

  this.getPreviousChatWithAUser();

} // end userBtnClick function






public sendMessageUsingKeypress: any = (event: any) => {

  if (event.keyCode === 13) { // 13 is keycode of enter.

    this.sendMessage();

  }

} // end sendMessageUsingKeypress

public sendMessage: any = () => {

  if(this.messageText){

    let chatMsgObject = {
      senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
      senderId: this.userInfo.userId,
      receiverName: Cookie.get('receiverName'),
      receiverId: Cookie.get('receiverId'),
      message: this.messageText,
      createdOn: new Date()
    } // end chatMsgObject
    console.log(chatMsgObject);
    this.socketService.SendChatMessage(chatMsgObject)
    this.pushToChatWindow(chatMsgObject)
    

  }
  else{
    this.toaster.warning('text message can not be empty')

  }

} // end sendMessage

public pushToChatWindow : any =(data)=>{

  this.messageText="";
  this.messageList.push(data);
  this.scrollToChatTop = false;


}// end push to chat window

public getMessageFromAUser :any =()=>{

    this.socketService.chatByUserId(this.userInfo.userId)
    .subscribe((data)=>{
     

      (this.receiverId==data.senderId)?this.messageList.push(data):'';

      this.toaster.success(`${data.senderName} says : ${data.message}`)

      this.scrollToChatTop=false;

    });//end subscribe

}// end get message from a user 


public logout: any = () => {

  this.appService.logout()
    .subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called")
        Cookie.delete('authtoken');

        Cookie.delete('receiverId');

        Cookie.delete('receiverName');

        this.socketService.exitSocket()

        this.router.navigate(['/']);

      } else {
        this.toaster.error(apiResponse.message)

      } // end condition

    }, (err) => {
      this.toaster.error('some error occured')


    });

} // end logout   
}


