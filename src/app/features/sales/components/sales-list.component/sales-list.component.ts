import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { forkJoin } from 'rxjs';

import { Sale, SaleView } from '../../model/sale';
import { SalesService } from '../../service/sales.service';

import { Product } from '../../../products/model/product';
import { Client } from '../../../clients/model/client';
import { Employee } from '../../../employees/model/employee';

import { ProductService } from '../../../products/service/product.service';
import { ClientService } from '../../../clients/service/client.service';
import { EmployeeService } from '../../../employees/service/employee.service';

import Swal from 'sweetalert2';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-list.component',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationModule,
   CommonModule

  ],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
})
export class SalesListComponent implements OnInit {


  sales: Sale[] = [];


  salesViewList: SaleView[] = [];
  saleItemPage: SaleView[] = [];
filteredSales: SaleView[] = [];

  products: Product[] = [];
  clients: Client[] = [];
  employees: Employee[] = [];

  itemsPerPage = 5;

  private saleServices = inject(SalesService);
  private productService = inject(ProductService);
  private clientService = inject(ClientService);
  private employeeService = inject(EmployeeService);
  private formFilter = inject(FormBuilder);

  formFilterData = this.formFilter.group({
    dato: [''],
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {

    forkJoin({
      sales: this.saleServices.getAll(),
      products: this.productService.getAll(),
      clients: this.clientService.getAll(),
      employees: this.employeeService.getAll()
    }).subscribe(({ sales, products, clients, employees }) => {

      this.sales = sales;
      this.products = products;
      this.clients = clients;
      this.employees = employees;

      this.buildSaleView();
    });
  }


  private buildSaleView(): void {

    this.salesViewList = this.sales.map(sale => {

      const client = this.clients.find(c => c.id === sale.clientId);
      const employee = this.employees.find(e => e.id === sale.employeeId);

      const productNames = sale.items.map(item => {
        const product = this.products.find(p => p.id === item.productId);
        return product?.product ?? '';
      });

      return {
        id: sale.id,
        clientName: client?.client ?? '',
        employeeName: employee?.employee ?? '',
        fecha: sale.fecha,
        productNames,
        total: sale.total
      };
    });


     this.filteredSales = this.salesViewList;
    this.saleItemPage = this.filteredSales.slice(0, this.itemsPerPage);

  }


  getfilterSale(): void {

    const name = this.formFilterData.get('dato')?.value?.toLowerCase() ?? '';

    if (!name) {
      this.filteredSales = this.salesViewList;
      return;
    }

    this.filteredSales= this.salesViewList.filter(sale =>
      sale.clientName.toLowerCase().includes(name) ||
      sale.employeeName.toLowerCase().includes(name) ||
      sale.productNames.some(p => p.toLowerCase().includes(name))
    );

    this.saleItemPage = this.filteredSales.slice(0, this.itemsPerPage);

  }


  eliminar(id: string): void {

    Swal.fire({
      title: 'Alerta',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {

      if (result.isConfirmed) {

        this.saleServices.delete(id).subscribe(() => {

          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });

          this.loadData();
        });
      }
    });
  }

  pageChanged(event: PageChangedEvent): void {

    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    this.saleItemPage = this.salesViewList.slice(startItem, endItem);
  }

}
