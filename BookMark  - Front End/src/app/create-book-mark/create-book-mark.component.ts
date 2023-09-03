import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { User } from '../Interface/user';
import { Router } from '@angular/router';
import { SiteService } from '../Service/site-service';
import { Site } from '../Interface/Site';
import { AuthService } from '../Service/auth-service';
declare var $: any;
@Component({
  selector: 'app-create-book-mark',
  templateUrl: './create-book-mark.component.html',
  styleUrls: ['./create-book-mark.component.css']
})
export class CreateBookMarkComponent {

  user: User={
    name:"",
    id:0,
    email:""
  };
  site: Site={
    id:0,
    link:"",
    name:"",
    description:""
  };
  token:string="";
  hasError:boolean=false;
  message:string="Site Added Successfully";
  overlayFlag:boolean=false;
  isUpdateBtn:boolean=false;
  updateForm:{
    name:string,
    link:string,
    description:string,
    user_id:number,
    id:number,
  }={
    name: '',
    link: '',
    description: '',
    user_id: 0,
    id: 0
  };
  sites:Site[]=[];

  createForm:FormGroup=new FormGroup({
    name:new FormControl(null,[Validators.required]),
    description:new FormControl(null ),
    link:new FormControl(null ,[Validators.required]) ,
    user_id: new FormControl(this.user.id)
  });
  

   constructor(private _site:SiteService , private _router:Router, private _auth:AuthService) { }

  clear(){
    this.createForm.reset();
  }
  getTokenAndUser(){
    this.token=localStorage.getItem("token")?? "";
    this.user=JSON.parse(localStorage.getItem("user")??"");
    //console.log("token"+this.token );
    //console.log(this.user );
    
  }
 
  setValueInForm(site:Site){
    //this.site=JSON.parse(localStorage.getItem("updatedSite")??"");
    //console.log(this.site.name);  
    this.createForm.setValue({
      name:this.site.name,
      link:this.site.link,
      description:this.site.description,
      user_id:this.user.id
    });
    //this.isUpdateBtn=true;
   
  }


  overlay(){
    this.overlayFlag=!this.overlayFlag;
  }

  getAllData(){
    this._site.getAll(this.token).subscribe(
      (response)=>{
        this.sites=response.data;
        localStorage.setItem("sites",JSON.stringify(this.sites));
      })
  }
  create(createForm:FormGroup){
    this.getTokenAndUser();    
    this._site.create(createForm.value, this.token).subscribe(
      (response)=>{
        //console.log(response);
        this.hasError=response.hasError;
        this.message=response.message;
        if(!response.hasError){
          this.clear();
          this.overlay(); 
          this.getAllData();      
          //this._router.navigate(['/home/show']); 
        }
      },
      (error)=>{
        //console.log(error);
        this.hasError=true;     
      }
    )

  }

  update(createForm:FormGroup){
    this.getTokenAndUser();  
    this.site=JSON.parse(localStorage.getItem("updatedSite")??""); 
    this.updateForm={
      name: createForm.value.name,
      link: createForm.value.link,
      description: createForm.value.description,
      user_id: this.user.id,
      id: this.site.id
    }
    //console.log(this.updateForm);
    
    this._site.update(this.updateForm, this.token).subscribe(
      (response)=>{
        //console.log(response);
        this.hasError=response.hasError;
        this.message=response.message;
        if(!response.hasError){
          this.clear();
          this.message="Site Updated Successfully";
          this.overlay();  
          this.getAllData();
          this.isUpdateBtn=false;
          localStorage.setItem("isUpdateBtn",JSON.stringify(false));
          //this._router.navigate(['/home/show']); 
        }
      },
      (error)=>{
        //console.log(error);
        this.hasError=true;     
      }
    )

  }

  ngOnInit() {
    this.token=localStorage.getItem("token")??"";
    if(this.token==""){
      localStorage.clear();
      this._router.navigate(["/login"]);
    }
    else{
      this._auth.getToken(this.token);
      this.isUpdateBtn=JSON.parse(localStorage.getItem("isUpdateBtn")??"false");
      if(this.isUpdateBtn){
        this.site=JSON.parse(localStorage.getItem("updatedSite")??"");
        this.setValueInForm(this.site);
      }
    }
  }
  
}
