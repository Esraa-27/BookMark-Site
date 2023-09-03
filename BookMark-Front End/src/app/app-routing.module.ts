import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CreateBookMarkComponent } from './create-book-mark/create-book-mark.component';
import { ShowBookMarkComponent } from './show-book-mark/show-book-mark.component';

const routes: Routes = [
  {path:"" , redirectTo:"login" , pathMatch:"full"},
  {path:"login" , component: LoginComponent},
  {path:"register" , component: RegisterComponent},
  {path: "home" , component: HomeComponent,children:[
    {path:"create" , component: CreateBookMarkComponent},
    {path:"show" , component: ShowBookMarkComponent}
  ]},
  {path:"**" , redirectTo:"login" , pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
