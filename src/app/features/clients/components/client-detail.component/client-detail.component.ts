import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../model/client';

@Component({
  selector: 'app-client-detail.component',
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css',
})
export class ClientDetailComponent implements OnInit {
ngOnInit(): void {

   this.activerouter.params.subscribe({
    next:(params)=>{
     this.id=params["id"]

     if(this.id){
      this.findById(this.id)
     }
    }
   });

 this.clientForm.get('fecha')?.valueChanges.subscribe(value => {
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (selectedDate > today) {
        this.clientForm.get('fecha')?.setErrors({ futureDate: true });
      }
    }
  });


  }

  private route=inject(Router);

  private activerouter=inject(ActivatedRoute);
private formBuilder=inject(FormBuilder);
private clientServie= inject(ClientService);
private toastr=inject(ToastrService);
private client?:Client;
 id?:string;
submitted:boolean=false;
departments: string[] = ["Áncash","Amazonas","Apurímac","Callao","Lima"];
clientForm = this.formBuilder.group({

    client:[
      "Cristian",

      [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]
    ],
    department: ['Lima',
[
      Validators.required
    ]
    ],
    email:["cristianronaldosalazarlopez@gmail.com",

 [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]
    ],
    phone:["997267549",

    [
      Validators.required,
      Validators.pattern(/^[0-9]{9}$/)
    ]
    ],
      fecha:["2024-11-01",

    [
      Validators.required
    ]
    ],


  });

  cancelar(){
    this.route.navigate(["home/client/list"])
  }
findById(id:string){
this.clientServie.findById(id).subscribe({
  next:(res)=>{
   this.clientForm.controls["client"].setValue(res.client);
   this.clientForm.controls["department"].setValue(res.department);
   this.clientForm.controls["email"].setValue(res.email);
   this.clientForm.controls["phone"].setValue(res.phone);
   this.clientForm.controls["fecha"].setValue(res.fecha);

  }
})
}


onSubmit(){
  this.submitted=true;
  
const client=this.clientForm.controls["client"].value?? ""
const department=this.clientForm.controls["department"].value??""
const email=this.clientForm.controls["email"].value??""
const phone= this.clientForm.controls["phone"].value??""
const fecha= this.clientForm.controls["fecha"].value??""



if(this.clientForm.invalid){
 return;
}

const clientRequest:Client={
  client,
   department,
   email,
   phone,
   fecha
}

if(this.id){
   this.clientServie.update(this.id,clientRequest).subscribe({
  next:(res)=>{
    this.client=res;

   this.toastr.info("La compñia fue modificada","Info")
this.route.navigate(["home/client/list"])
  },
  error:(err)=>{
  this.toastr.error("Error al registrar la compañia","Error");
  }
})
     }else{
this.clientServie.save(clientRequest).subscribe({
  next:(res)=>{
    this.client=res;

    this.toastr.success("La compañia ha sido agregada");
   this.route.navigate(["home/client/list"])
  }
})
     }


}


get cf(): {[key:string]:AbstractControl}{

  return this.clientForm.controls
}

}
