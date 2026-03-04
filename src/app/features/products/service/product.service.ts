

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';


@Injectable({
  providedIn: 'root',
})
export class ProductService {


private httpClient=inject(HttpClient);
  urlBase="http://localhost:3000/products"

getAll():Observable<Product[]>{
  return this.httpClient.get<Product[]>(this.urlBase);
}

filterByProduct(name: string): Observable<Product[]> {

  let params = new HttpParams();

  if (name) {
    params = params.set('product_like', name);
  }



  return this.httpClient.get<Product[]>(this.urlBase, { params });
}


findById(id:string):Observable<Product>{

  return this.httpClient.get<Product>(`${this.urlBase}/${id}`);
}

save(Product:Product):Observable<Product>{


  return this.httpClient.post<Product>(this.urlBase,Product);
}

update(id:string,Product:Product):Observable<Product>{


  return this.httpClient.put<Product>(`${this.urlBase}/${id}`,Product);
}


delete(id:string):Observable<Product>{


  return this.httpClient.delete<Product>(`${this.urlBase}/${id}`);
}





}
