import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private router = inject(Router);
private formBouilderLogin=inject(FormBuilder);
private toastr=inject(ToastrService);
private LoginService=inject(LoginService);
submitted:boolean=false;
loginForm=this.formBouilderLogin.group({
  user:[
    "CristianProject",
    [Validators.required,Validators.minLength(8)]
  ],
    password:[
    "12345678",
    [Validators.required,Validators.minLength(8)]
  ]
})
  ingresar(){
    this.submitted=true;
   const user=this.LoginService.USUARIO;
   const password=this.LoginService.CONTRASEÑA;

   const userInput=this.loginForm.controls["user"].value;
   const passwordInput=this.loginForm.controls["password"].value;



    if(!(user===userInput) && !(password===passwordInput)){

    this.toastr.error("El usuario no coincide","Error")

      return;

  }

  this.router.navigate(['home'])
}
  get cf():{[key:string]:AbstractControl}{
   return this.loginForm.controls
  }
}
