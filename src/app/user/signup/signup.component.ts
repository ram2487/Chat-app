import { Component, OnInit } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public email: any;
  public password: any;
  public apiKey: any;
  constructor(
    public appService: AppService,
    public router: Router,
    public toaster:ToastrService
  ) { }

  ngOnInit(): void {
  }
  public goToSignIn(): any {
    this.router.navigate(['/login']);
  }

  public signUp(): any {

    let postData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      apiKey: this.apiKey
    }
    console.log(postData);
    
   this.appService.signup(postData).subscribe(
        response => {
          console.log("posting data");
          console.log(response);
          if(response.status == 200){
              this.toaster.show("Success!","You have signed up to chat");
              this.goToSignIn();
          }
        },
        error => {
          console.log("error" + error.error);

        }
      );
  }
}
