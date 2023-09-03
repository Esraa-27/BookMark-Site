import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  baseApiUrl:string= environment.baseApiUrl;
  token:string="";

  constructor(private _http:HttpClient, private _router:Router) { }
  
  
  register(form: object): Observable<any> {
    return this._http.post(this.baseApiUrl + `auth/register`, form);
  }

  login(form: FormGroup): Observable<any> {
    return this._http.post(this.baseApiUrl + `auth/login`, form);
  }
  logout(token: string): Observable<any> {
    return this._http.get(this.baseApiUrl + "auth/logout?token="+token);
  }
  refresh(token: string): Observable<any> {
    return this._http.get(this.baseApiUrl + "auth/refresh?token=" + token);
  }
  userProfile(token: string): Observable<any> {
    return this._http.get(this.baseApiUrl + "auth/user-profile?token=" + token);
  }


  getToken(token:string){
    this.token=JSON.stringify(localStorage.getItem("token")??"");
    this.refresh(token).subscribe(
      (response)=>{
        //console.log(response);
        this.token=response.token;
        localStorage.setItem('token',this.token);
      },
      (error)=>{
        console.log(error);
        localStorage.clear();
        this._router.navigate(["/login"]);
      })
  }
}
