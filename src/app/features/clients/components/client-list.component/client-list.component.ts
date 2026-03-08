import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, TemplateRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { Client } from '../../model/client';
import { Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list.component',
  imports: [
    ReactiveFormsModule,
    ModalModule,
    PaginationModule
  ],
   providers:[
  BsModalService
 ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
  ,
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
  standalone:true
})
export class ClientListComponent {
  clients:Client[]=[];
  clientItemPage:Client[]=[];
   private router = inject(Router);
  private clientServices = inject(ClientService);
  private formBuilder=inject(FormBuilder);
itemsPerPage=5;
 modalRef?: BsModalRef;
 private modalService=inject(BsModalService);
clientSelected?:Client
 formData = this.formBuilder.group({
  clientname: [''],
  department:['']
});
departments:string[]=[];
ngOnInit(){
 this.getAll();

}


newElement() {

    this.router.navigate(['home/client/detail']);
  }
  modificar(client: Client) {

    this.router.navigate(['home/client/detail', client.id]);
  }
  eliminar(id: string): void {
    Swal.fire({
      title: 'Alerta',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          this.clientServices.delete(id).subscribe({
            next: (res) => {

        this.getAll();
              Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
              });
            },
          });
        }
      }
    });
  }
 getAll(): void {
    this.clientServices.getAll().subscribe({
      next: (res) => {

        this.clients= res;
          this.departments = [...new Set(this.clients.map(c => c.department))];

      },
      error: () => {},
      complete: () => {},
    });
  }










getfilterClient(): void {
 const name=this.formData.get('clientname')?.value??"";
 const department=this.formData.get("department")?.value??"";

    this.clientServices.filterByClient(name,department).subscribe({
      next: (res) => {

        this.clients = res;
        this.clientItemPage=this.clients.slice(0,this.itemsPerPage)
        this.formData.get("clientname")?.setValue("");
        this.formData.get("department")?.setValue("");
      },
      error: () => {},
      complete: () => {},
    });
  }
  clear(){

this.clientItemPage=[]


}
 pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    this.clientItemPage=this.clients.slice(startItem,endItem);
  }
 view(client:Client,template: TemplateRef<void>) {
  this.clientSelected=client;
  this.modalRef = this.modalService.show(template);
  }

}
