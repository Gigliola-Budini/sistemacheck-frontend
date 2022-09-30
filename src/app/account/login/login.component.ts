import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { ValidatorService } from "src/app/core/services/validator.service";
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService,private router: Router,
    private authFackservice: AuthfakeauthenticationService,private route: ActivatedRoute,public toastService: ToastService,
    private validatorSerice: ValidatorService) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
     }

  ngOnInit(): void {
    if(localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }

    // this.authenticationService.register('17952673-5','Gigliola','2').subscribe({
    //   next: (res)=>{
    //     console.log(res);
        
    //   }
    // })
    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
      rut: ['admin@themesbrand.com', [Validators.required]],
      pass: ['123456', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    let valid = this.validatorSerice.validarRut(this.f['rut'].value);
    if (!valid) {
      console.log(valid);
      
      this.toastService.show('El Rut no es válido', { classname: 'bg-danger text-white', delay: 15000 });
    }
    this.submitted = true;

    // Login Api
    this.authenticationService.login(this.f['rut'].value, this.f['pass'].value).subscribe((res:any) => {      
      console.log(res);
      
      if(res.completeAccess){
        localStorage.setItem('toast', 'true');
        localStorage.setItem('currentUser', JSON.stringify(res.nombre));
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      } else {
        this.toastService.show(res.data, { classname: 'bg-danger text-white', delay: 15000 });
      }
    });

    // this.authenticationService.login2(this.f['rut'].value, this.f['pass'].value).subscribe((res:any) => {      
    //   console.log();
      
    //   if(res.status == 'success'){
    //     localStorage.setItem('toast', 'true');
    //     localStorage.setItem('currentUser', JSON.stringify(res.data));
    //     localStorage.setItem('token', res.token);
    //     this.router.navigate(['/']);
    //   } else {
    //     this.toastService.show(res.data, { classname: 'bg-danger text-white', delay: 15000 });
    //   }
    // });

    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.router.navigate(['/']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate(['/']);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
