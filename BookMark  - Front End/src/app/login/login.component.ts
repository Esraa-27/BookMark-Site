import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { AuthService } from '../Service/auth-service';
import { Router } from '@angular/router';
import { User } from '../Interface/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm:FormGroup=new FormGroup({
    email:new FormControl(null ,[Validators.email, Validators.required ]),
    password:new FormControl(null , [Validators.required ,Validators.minLength(6), Validators.pattern("[A-Za-z-1-9]+")] )    
  })
  
  token:string="";
  user!: User;
  errors: [] = [];
  isError:Boolean=false;

  constructor(private _auth:AuthService , private _router:Router) { }


  login(loginForm:FormGroup){
    console.log(loginForm.value);
    this._auth.login(loginForm.value).subscribe(
      (response)=>{
        console.log(response);
        this.token=response.token;
        localStorage.setItem('token',this.token);
        this.user=response.user;
        localStorage.setItem('user',JSON.stringify(this.user));

        this._router.navigate(['/home/create']);
        

      },
      (error)=>{
        console.log(error);
        this.isError=true;
        this.errors=error.error.error;

      })
  }

  
  
  ngOnInit(): void {
    localStorage.clear();
  }

}
