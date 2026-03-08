import { Component, inject, TemplateRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { Product } from '../../model/product';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-products-list.component',
  imports: [
    ReactiveFormsModule,

    PaginationModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent {

products:Product[]=[];
productItemPage:Product[]=[];
   private router = inject(Router);
  private productServices = inject(ProductService);
  private formBuilder=inject(FormBuilder);
itemsPerPage=5;
productSelected?:Product
 formData = this.formBuilder.group({
  product: [''],
  department:['']
});
ngOnInit(){
 this.getAll();

}
newElement() {

    this.router.navigate(['home/product/detail']);
  }
 modificar(product: Product) {

   this.router.navigate(['home/product/detail',product.id]);
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
          this.productServices.delete(id).subscribe({
            next: (res) => {


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
    this.productServices.getAll().subscribe({
      next: (res) => {

        this.products= res;


      },
      error: () => {},
      complete: () => {},
    });
  }
getfilterProduct(): void {
 const name=this.formData.get('product')?.value??"";


    this.productServices.filterByProduct(name).subscribe({
      next: (res) => {

        this.products = res;
        this.productItemPage=this.products.slice(0,this.itemsPerPage)

        this.formData.get("product")?.setValue("");

      },
      error: () => {},
      complete: () => {},
    });
  }
  clear(){

this.productItemPage=[]


}
 pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    this.productItemPage=this.products.slice(startItem,endItem);

  }


}
