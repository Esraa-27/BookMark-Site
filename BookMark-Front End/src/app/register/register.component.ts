import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { AuthService } from '../Service/auth-service';
import { User } from '../Interface/user';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registerForm:FormGroup=new FormGroup({
    name:new FormControl(null ,[Validators.minLength(2),Validators.required ] ),
    email:new FormControl(null ,[Validators.email, Validators.required ]),
    password:new FormControl(null , [Validators.required ,Validators.minLength(6), Validators.pattern("[A-Za-z1-9]+")] )    
  });

  token:string="";
  user!: User;
  errors: [] = [];
  isError:Boolean=false;
  constructor(private _auth:AuthService ,private _router:Router) { }

  register(registerForm:FormGroup){
    //console.log(registerForm.value);
    this._auth.register(registerForm.value).subscribe(
      (response)=>{
        //console.log(response);
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
  }

}
