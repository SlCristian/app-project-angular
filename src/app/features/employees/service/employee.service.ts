import { inject, Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

private httpClient=inject(HttpClient);
  urlBase="http://localhost:1234/employees"

getAll():Observable<Employee[]>{
  return this.httpClient.get<Employee[]>(this.urlBase);
}

filterByEmployee(name: string): Observable<Employee[]> {

  let params = new HttpParams();

  if (name) {
    params = params.set('employee_like', name);
  }



  return this.httpClient.get<Employee[]>(this.urlBase, { params });
}


findById(id:string):Observable<Employee>{

  return this.httpClient.get<Employee>(`${this.urlBase}/${id}`);
}

save(Employee:Employee):Observable<Employee>{


  return this.httpClient.post<Employee>(this.urlBase,Employee);
}

update(id:string,Employee:Employee):Observable<Employee>{


  return this.httpClient.put<Employee>(`${this.urlBase}/${id}`,Employee);
}


delete(id:string):Observable<Employee>{


  return this.httpClient.delete<Employee>(`${this.urlBase}/${id}`);
}




}
