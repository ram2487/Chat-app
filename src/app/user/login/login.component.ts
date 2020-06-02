import { Component, OnInit } from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies'
import { from } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: any;
  public password: any;
  

  constructor(public appService: AppService,
              public router: Router,
              public toaster:ToastrService
    ) { }

  ngOnInit(): void {
  }

  public login(): any {

    let postData = {
      email: this.email,
      password: this.password,
    }
    console.log(postData);
    
   this.appService.signIn(postData).subscribe(
        response => {
          console.log("logging in");
          
          if(response.status == 200){
              console.log(response);
              Cookie.set('authToken',response.data.authToken);
              Cookie.set('receiverId',response.data.userDetails.userId);
              Cookie.set('receiverName',response.data.userDetails.firstName);
              this.appService.setUserInfoInLocalStorage(response.data.userDetails);
              this.toaster.show("You have logged in to chat","Success!");
              this.goToChat();
          }
        },
        error => {
          console.log("error" + error.error);

        }
      );
  }
 
  public goToChat() {
    this.router.navigate(['/chat']);
  }
}
