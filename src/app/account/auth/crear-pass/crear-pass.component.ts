import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from 'src/app/core/services/auth.service';

import { PassService } from "src/app/core/services/pass.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pass',
  templateUrl: './crear-pass.component.html',
  styleUrls: ['./crear-pass.component.scss']
})
export class CrearPassComponent implements OnInit {

  token:string;
   // Login Form
   passresetForm!: UntypedFormGroup;
   submitted = false;
   passwordField!: boolean;
   confirmField!: boolean;
   error = '';
   returnUrl!: string;
   // set the current year
   year: number = new Date().getFullYear();
   notMatch = false
 
   constructor(private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
     private router: Router, 
     private passService:PassService, 
     private authService: AuthenticationService) { }
 
   ngOnInit(): void {
     /**
      * Form Validatyion
      */
      this.token = this.route.snapshot.paramMap.get('token');
      // console.log("token ",this.token);

      this.passresetForm = this.formBuilder.group({
       password: ['', [Validators.required]],
       cpassword: ['', [Validators.required]]
     });

      // Password Validation set
      var myInput = document.getElementById("password-input") as HTMLInputElement;
      var myInputCf = document.getElementById("confirm-password-input") as HTMLInputElement;
      var letter = document.getElementById("pass-lower");
      var capital = document.getElementById("pass-upper");
      var number = document.getElementById("pass-number");
      var length = document.getElementById("pass-length");

      // When the user clicks on the password field, show the message box
      myInput.onfocus = function () {
        let input = document.getElementById("password-contain") as HTMLElement;
        input.style.display = "block"
      };

      // When the user clicks outside of the password field, hide the password-contain box
      myInput.onblur = function () {
        let input = document.getElementById("password-contain") as HTMLElement;
        input.style.display = "none"
      };

      // When the user starts to type something inside the password field
      myInput.onkeyup = function () {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-zA-Z]/g;
        if (myInput.value.match(lowerCaseLetters)) {
            letter?.classList.remove("invalid");
            letter?.classList.add("valid");
        } else {
            letter?.classList.remove("valid");
            letter?.classList.add("invalid");
        }

        // Validate capital letters
        // var upperCaseLetters = /[A-Z]/g;
        // if (myInput.value.match(upperCaseLetters)) {
        //     capital?.classList.remove("invalid");
        //     capital?.classList.add("valid");
        // } else {
        //     capital?.classList.remove("valid");
        //     capital?.classList.add("invalid");
        // }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number?.classList.remove("invalid");
            number?.classList.add("valid");
        } else {
            number?.classList.remove("valid");
            number?.classList.add("invalid");
        }

        // Validate length
        if (myInput.value.length >= 6) {
            length?.classList.remove("invalid");
            length?.classList.add("valid");
        } else {
            length?.classList.remove("valid");
            length?.classList.add("invalid");
        }
      };
      myInputCf.onkeyup = () =>{
        if(myInputCf.value !== myInput.value){
          this.f['cpassword'].setErrors({'notValid':true})
        }else{
          this.f['cpassword'].reset
        }
      }
      this.validarCambioClave();
      
   }
 
   // convenience getter for easy access to form fields
   get f() { return this.passresetForm.controls; }
 
   /**
    * Form submit
    */
    onSubmit() {
     this.submitted = true;
 
     // stop here if form is invalid
     if (this.passresetForm.invalid) {
       return;
     }

     this.passService.changePass(this.f['password'].value, this.token).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res == 'OK'){
          this.successmsg('Contraseña creada', '')
        }
        
      },
      error:(err)=>{
        this.modelTitle('Error', 'Ocurrió un problema al crear la contraseña')
        console.log(err);
        
      }
     })
   }

   /**
   * Password Hide/Show
   */
    togglepasswordField() {
      this.passwordField = !this.passwordField;
    }

    /**
   * Password Hide/Show
   */
    toggleconfirmField() {
      this.confirmField = !this.confirmField;
    }
    cambiarClaveUsuario(){

    }
  
    validarCambioClave(){
      console.log('bhvh');
      this.authService.logout();
      this.passService.verifyChangePass(this.token).subscribe({next:(res:any)=>{
        if(res!= 'OK'){
          this.modelTitle('El link esta expirado','redirigiendo al inicio')
          this.authService.logout();
          this.router.navigate(['/']);
        }
      }})
     
    }
    successmsg(title, mes) {
      Swal.fire({
        title: title,
        text: mes,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#1721C3',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'OK'
      });
    }
  
    modelTitle(title, msg) {
      Swal.fire({
        title: title,
        text: msg,
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#1721C3',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Ok'
      });
    }

}
