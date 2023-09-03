import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  token:string="";


  constructor(private _auth:AuthService , private _router:Router) { }

  logout(){
    this.token=localStorage.getItem("token")??"";
    if(this.token !=""){
      this._auth.logout(this.token).subscribe(
        (response)=>{
          localStorage.clear();
          this._router.navigate(["/login"]);
        },
        (error)=>{
          localStorage.clear();
          this._router.navigate(["/login"]);
        }
      )
    }
  }


}
