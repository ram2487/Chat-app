import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Cookie} from "ng2-cookies/ng2-cookies";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public _httpClient: HttpClient) {
    console.log("HTTP service running");
  }

  public setUserInfoInLocalStorage(data){
    localStorage.setItem('userInfo',JSON.stringify(data));
  }

  public getUserInfoFromLocalStorage():any{
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public signup(data):Observable<any>{
    
    const params = new HttpParams()
          .set('firstName', data.firstName)
          .set('lastName', data.lastName)
          .set('mobile', data.mobile)
          .set('email', data.email)
          .set('password', data.password)
          .set('apiKey', data.apiKey)

          return this._httpClient.post('https://chatapi.edwisor.com/api/v1/users/signup',params)
  }


  public signIn(data):Observable<any>{
    
    const params = new HttpParams()
          .set('email', data.email)
          .set('password', data.password)

          return this._httpClient.post('https://chatapi.edwisor.com/api/v1/users/login',params)
  }
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

    return this._httpClient.post(`https://chatapi.edwisor.com/api/v1/users/logout`, params);

  } // end logout function


}
