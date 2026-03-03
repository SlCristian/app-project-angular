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
  //para leer los parametros de los id//
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
      //Validacion aca uu
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
  //quiero el valor uu
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
console.log(clientRequest)
if(this.id){
   this.clientServie.update(this.id,clientRequest).subscribe({
  next:(res)=>{
    this.client=res;
    //console.log(this.client)
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
    console.log(this.client)
    this.toastr.success("La compañia ha sido agregada");
   this.route.navigate(["home/client/list"])
  }
})
     }


}

/*es un get, o sea una propiedad y se usa en typescript
retorna el obeto que contiene todo slo scontroles del formlario reactivo
{ [key: string]: AbstractControl } : "Un objeto cuyas claves son string y cuyos valores son AbstractControl" las claves recuerda que no solo pueden se string pero lo normal si xddd
*/
get cf(): {[key:string]:AbstractControl}{
  //console.log(this.clientForm.controls)
  return this.clientForm.controls
}
/* esto : tghis.clientForm.controles retorna algo como :{
  name: FormControl,
  country: FormControl

}
👉 Un objeto
👉 Donde cada propiedad es un FormControl
👉 No devuelve valores
👉 No devuelve errores
👉 Devuelve controles

para que quede claro:
this.clientForm.controls no devuelve : { name: "Cristian", country: "Perú" }
eso devuelve: this.clientForm.value

ENTONCES CUANDO LO HACE USO LOS CONTORLS
cf['country'].invalid
1️⃣ cf → retorna clientForm.controls
2️⃣ cf['country'] → devuelve el FormControl del country
3️⃣ .invalid → es una propiedad del AbstractControl



*/
}
