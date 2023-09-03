import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  baseApiUrl:string= environment.baseApiUrl;

  constructor(private _http:HttpClient) { }
  
  
  create(form: object,token:string): Observable<any> {
    return this._http.post(this.baseApiUrl + "site/create?token="+token, form);
  }

  update(form: object,token:string): Observable<any> {
    return this._http.post(this.baseApiUrl + "site/update?token="+token, form);
  }
  getAll(token:string): Observable<any> {
    return this._http.get(this.baseApiUrl + "site/get-all?token="+token);
  }
  
  getById(id: number , token:string): Observable<any> {
    return this._http.get(this.baseApiUrl + "site/get/"+id+"?token="+token);
  }
  delete(id: number , token:string): Observable<any> {
    return this._http.delete(this.baseApiUrl + `site/delete/`+id+"?token="+token);
  }
}
