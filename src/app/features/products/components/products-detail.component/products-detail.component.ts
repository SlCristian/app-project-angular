import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../model/product';

@Component({
  selector: 'app-products-detail.component',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.css',
})
export class ProductsDetailComponent implements OnInit {

ngOnInit(): void {

   this.activerouter.params.subscribe({
    next:(params)=>{
     this.id=params["id"]

     if(this.id){
      this.findById(this.id)
     }
    }
   });

 this.productForm.get('fecha')?.valueChanges.subscribe(value => {
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (selectedDate > today) {
        this.productForm.get('fecha')?.setErrors({ futureDate: true });
      }
    }
  });


  }

  private route=inject(Router);

  private activerouter=inject(ActivatedRoute);
private formBuilder=inject(FormBuilder);
private productService= inject(ProductService);
private toastr=inject(ToastrService);
private product?:Product;
 id?:string;
submitted:boolean=false;
departments: string[] = ["Áncash","Amazonas","Apurímac","Callao","Lima"];
productForm = this.formBuilder.group({

    product:[
      "Teclado",
      //Validacion aca uu
        [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
  ]
    ],
    price: [32.4,
 [
    Validators.required,
    Validators.min(0.01),
    Validators.pattern(/^\d+(\.\d{1,2})?$/)
  ]
    ],
    stock:[4,

[
    Validators.required,
    Validators.min(0),
    Validators.max(10000),
    Validators.pattern(/^[0-9]+$/)
  ]
    ],
    active:[true,

   [
    Validators.requiredTrue
  ]
    ]



  });

  cancelar(){
    this.route.navigate(["home/product/list"])
  }
findById(id:string){
this.productService.findById(id).subscribe({
  next:(res)=>{
   this.productForm.controls["product"].setValue(res.product);
   this.productForm.controls["price"].setValue(res.price);
   this.productForm.controls["stock"].setValue(res.stock);
   this.productForm.controls["active"].setValue(res.active);


  }
})
}


onSubmit(){
  this.submitted=true;

const product=this.productForm.controls["product"].value?? ""
const price=Number(this.productForm.controls["price"].value)??0
const stock=Number(this.productForm.controls["stock"].value)??0
const active= this.productForm.controls["active"].value??true




if(this.productForm.invalid){
 return;
}

const productRequest:Product={
  product,
   price,
   stock,
   active

}

if(this.id){
   this.productService.update(this.id,productRequest).subscribe({
  next:(res)=>{
    this.product=res;

   this.toastr.info("La compñia fue modificada","Info")
this.route.navigate(["home/product/list"])
  },
  error:(err)=>{
  this.toastr.error("Error al registrar la compañia","Error");
  }
})
     }else{
this.productService.save(productRequest).subscribe({
  next:(res)=>{
    this.product=res;
   
    this.toastr.success("La compañia ha sido agregada");
   this.route.navigate(["home/product/list"])
  }
})
     }


}

get cf(): {[key:string]:AbstractControl}{

  return this.productForm.controls
}


}
