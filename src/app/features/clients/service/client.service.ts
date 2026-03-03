import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../model/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private httpClient=inject(HttpClient);
  urlBase="http://localhost:3000/clients"

getAll():Observable<Client[]>{
  return this.httpClient.get<Client[]>(this.urlBase);
}

filterByClient(name: string, department: string): Observable<Client[]> {

  let params = new HttpParams();

  if (name) {
    params = params.set('client_like', name);
  }

  if (department) {
    params = params.set('department_like', department);
  }

  return this.httpClient.get<Client[]>(this.urlBase, { params });
}


findById(id:string):Observable<Client>{

  return this.httpClient.get<Client>(`${this.urlBase}/${id}`);
}
/*SESION 04 */
save(Client:Client):Observable<Client>{
  console.log(JSON.stringify(Client))

  return this.httpClient.post<Client>(this.urlBase,Client);
}

update(id:string,Client:Client):Observable<Client>{
  console.log(JSON.stringify(Client))

  return this.httpClient.put<Client>(`${this.urlBase}/${id}`,Client);
}


delete(id:string):Observable<Client>{


  return this.httpClient.delete<Client>(`${this.urlBase}/${id}`);
}



}
