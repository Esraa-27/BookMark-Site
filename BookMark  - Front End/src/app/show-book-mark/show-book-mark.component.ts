import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../Service/site-service';
import { User } from '../Interface/user';
import { Site } from '../Interface/Site';
import { AuthService } from '../Service/auth-service';

@Component({
  selector: 'app-show-book-mark',
  templateUrl: './show-book-mark.component.html',
  styleUrls: ['./show-book-mark.component.css']
})
export class ShowBookMarkComponent  {

  user: User={
    name:"",
    id:0,
    email:""
  };
  token:string="";
  sites:Site[]=[];
  isEmpty:boolean=false;
  hasError:boolean=false;
  isDeleted:boolean=false;
  messageOfDelete:string="";
  updatedSite:Site={
    id: 0,
    name: '',
    link: '',
    description: ''
  };
  constructor(private _site:SiteService ,
              private _router:Router,
              private _auth:AuthService
              ) { }

  getAll(){
    this.token=localStorage.getItem("token")??"";
    this._site.getAll(this.token).subscribe(
      (response)=>{
        //console.log(response);
        this.sites=response.data;
        if(this.sites.length<1){
          this.isEmpty=true;
        }else{
          localStorage.setItem("sites",JSON.stringify(this.sites));
        }
        
      },
      (error)=>{
        //console.log(error);
        if(error.message=="Unauthorized"){
          this._router.navigate(["/login"]);
          localStorage.clear();
        }
        this.hasError=true;

      }
    )
  }

  getById(id:number){
    this.token=localStorage.getItem("token")??"";
    this.sites=JSON.parse(localStorage.getItem("sites")??"[]");
    this.updatedSite=this.sites.find(s=>s.id==id)??this.updatedSite;
    if(this.updatedSite.id!=0){
        localStorage.setItem("updatedSite",JSON.stringify(this.updatedSite));
    }
    
  }
  
  Update(id:number){ 
    //console.log("update = "+id);
    this.getById(id);
    this.updatedSite=JSON.parse(localStorage.getItem("updatedSite")??"");
    if(this.updatedSite.id!=0){
      //console.log("updatedSite in show");
      //console.log(this.updatedSite);
      localStorage.setItem("isUpdateBtn",JSON.stringify(true));
      this._router.navigate(['/home/create']);
    }else{
      console.log("has error when get site by id");
      
    }
  }
  Delete(id:number){
    //console.log("delete "+id);
    this._site.delete(id, this.token).subscribe(
      (response)=>{
        this.isDeleted=true;
        this.messageOfDelete=response.message;
        setTimeout(
          ()=>{
            this.isDeleted=false;
          },5000 )
        this.getAll();
      },
      (error)=>{
        //console.log(error.message);
        
        if(error.message=="Unauthorized"){
          this._router.navigate(["/login"]);
          localStorage.clear();
        }else{
          this.isDeleted=true;
          setTimeout(
            ()=>{
              this.isDeleted=false;
            },5000 )
          this.messageOfDelete="Sorry , Something Wrong";
        }
      }
    )
    
  }



  ngOnInit():void{
    this.token=localStorage.getItem("token")??"null";
    if(this.token=="null"){
      localStorage.clear();
      this._router.navigate(["/login"]);
    }else{
      localStorage.setItem("isUpdateBtn",JSON.stringify(false));
      this.getAll();
      this.sites=JSON.parse( localStorage.getItem("sites")??"");
      this._auth.getToken( this.token);
    }
  }
}
