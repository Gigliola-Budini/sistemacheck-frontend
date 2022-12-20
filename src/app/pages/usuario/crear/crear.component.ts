import { Component, OnInit } from '@angular/core';
import { Usuario } from "../usuario.model";
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";
import { UsuarioService } from "src/app/core/services/usuario.service";
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidatorService } from "src/app/core/services/validator.service";

// Sweet Alert
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

const hospitales = [
  {id:1, nombre:"Hospital de San Fernando"}];

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})


export class CrearComponent implements OnInit {
  breadCrumbItems:Array<{}>;
  userForm : UntypedFormGroup;
  usuario:Usuario = {
    rut:'',
    nombre:'',
    primerApellido:'',
    segundoApellido:'',
    idServicio: undefined,
    idRol:undefined,
    idHospital:undefined,
    correo:''
  }
  confirmarCorreoform:any;
  centrosSalud: any[];
  dataCentrosSalud: any[];
  roles:any[];
  serviciosSalud:any[];
  cargando:boolean= false;
  

  constructor(private restApiService:RestApiCheckService, 
    private validarService:ValidatorService,
    private formBuilder: UntypedFormBuilder, 
    private usuarioService: UsuarioService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Usuarios' },
      { label: 'Crear', active: true }
    ];
    this.userForm =  this.formBuilder.group({
      correo: [this.usuario.correo, [Validators.required, Validators.email]],
      // rut: [this.user.rut, [Validators.required]],
      nombre:[this.usuario.nombre, [Validators.required]],
      primerApellido:[this.usuario.primerApellido,  [Validators.required]],
      segundoApellido:[this.usuario.segundoApellido, [Validators.required]],
      idRol:[this.usuario.idRol, [Validators.required]],
      idHospital:[{value:this.usuario.idHospital,disabled:true}, [Validators.required]],
      rut: [this.usuario.rut, [Validators.required,Validators.minLength(8)]],
      idServicio:[this.usuario.idServicio, [Validators.required]],
      confirmarCorreo: [this.confirmarCorreoform, [Validators.required, Validators.email]],
    })

   
    this.obtenerRoles()
    this.obtenerCentrosSalud();
    this.obtenerServiciosSalud()
    // this.centrosSalud= hospitales
  }

  get f() { return this.userForm.controls; }
  get correo() { return this.userForm.get('correo'); }
  get rut() { return this.userForm.get('rut'); }
  get nombre() { return this.userForm.get('nombre'); }
  get primerApellido() { return this.userForm.get('primerApellido'); }
  get segundoApellido() { return this.userForm.get('segundoApellido'); }
  get idRol() { return this.userForm.get('idRol'); }
  get idHospital() { return this.userForm.get('idHospital'); }
  get idServicio() { return this.userForm.get('idServicio'); }
  get confirmarCorreo() { return this.userForm.get('confirmarCorreo'); }

  obtenerRoles(){
    this.restApiService.getRoles().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res){
          this.roles = res
        }
       
        
      }
    })
    // this.roles = [{id: 1,nombre:'Encargado de DiagnoChile'}]
  }

  obtenerCentrosSalud(){
    this.restApiService.getHospitales().subscribe({
      next:(res:any)=>{
        if(res.length){
          this.dataCentrosSalud = res
        }
      }
    })
  }

  obtenerServiciosSalud(){
    this.restApiService.getServiciosSalud().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.length){
          this.serviciosSalud = res
        }
      }
    })
  }

  crearUsuario(){
    
    console.log(this.userForm.value);

    if (!this.validarService.validarRut(this.rut.value)) {
      console.log(this.userForm.get('rut'));
      
      this.userForm.get('rut').setErrors({notValid: true})
      return;
    }

    if(!this.userForm.valid ){
      return;
    }
    this.cargando = true
    let usuarioAux = {
      name: this.nombre.value + ' '+ this.primerApellido.value + ' '+this.segundoApellido.value,
      rut: this.rut.value,
      idHospital: this.idHospital.value,
      idRol: this.idRol.value,
      email: this.correo.value,
      password: "check.2022v1.0",
    }
    this.usuarioService.createUser(usuarioAux).subscribe({
      next:(res:any)=>{
        console.log(res);
          if(res.id){
            let userPass= {
              idUser: res.id,
              userName: usuarioAux.name,
              email: usuarioAux.email
            }
            this.usuarioService.sendEmailPass(userPass).subscribe({
              next: (res:any)=>{
                console.log(res);
                if(res){
                  
                  this.timermsg('Usuario registrado','Se ha enviado un link al correo del usuario para establecer la contraseña.')
                }else{
                  this.modelTitle('No se pudo crear el Usuario')
                }
                this.cargando = false;
              },
              error:this.handleError.bind(this)
            })
          }else if(res.message){
            this.modelTitle(res.message)
            this.cargando = false;
          }else{
            this.modelTitle('No se pudo crear el Usuario')
            this.cargando = false;
          }
          
        }, 
        error: (err)=>{ 
          this.modelTitle('No se pudo creor el usuario')
          console.log(err)
        this.cargando = false;}
          
    })
  }
  filtrarControlHospitales(){

    console.log(this.idServicio);
    if(this.idServicio.status == 'VALID'){
      this.idHospital.enable()
      this.centrosSalud = this.dataCentrosSalud.filter(elem => {
        return elem.fkServicioSalud == this.idServicio.value
      })
    }else{
      this.centrosSalud = []
      this.idHospital.disable()
    }
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

  modelTitle(msg) {
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#364574',
      confirmButtonText: 'Ok'
    });
  }

  handleError(err){
    this.modelTitle('err')
    console.log(err);
    
  }

   /**
   * timer sweet alert
   * @param timer modal content
   */
  timermsg(title, msg) {
      let timerInterval: any;
      Swal.fire({
        title: title,
        html: msg,
        timer: 3000,
        timerProgressBar: false,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            const content = Swal.getHtmlContainer();
            if (content) {
              const b: any = content.querySelector('b');
              if (b) {
                b.textContent = Swal.getTimerLeft();
              }
            }
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
        
      }).then((result) => {
        /* Read more about handling dismissals below */
        console.log('se ejecuto');
        
        this.router.navigate(['/usuarios/listar'])
        if (result.dismiss === Swal.DismissReason.timer) {
          
          

        }
      });
    }


}
