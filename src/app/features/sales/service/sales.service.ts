import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../model/sale';

@Injectable({
  providedIn: 'root',
})
export class SalesService {

private httpClient=inject(HttpClient);
  urlBase="http://localhost:1234/sales"

getAll():Observable<Sale[]>{
  return this.httpClient.get<Sale[]>(this.urlBase);
}



findById(id:string):Observable<Sale>{

  return this.httpClient.get<Sale>(`${this.urlBase}/${id}`);
}

save(Sale:Sale):Observable<Sale>{


  return this.httpClient.post<Sale>(this.urlBase,Sale);
}

update(id:string,Sale:Sale):Observable<Sale>{


  return this.httpClient.put<Sale>(`${this.urlBase}/${id}`,Sale);
}


delete(id:string):Observable<Sale>{


  return this.httpClient.delete<Sale>(`${this.urlBase}/${id}`);
}






}
