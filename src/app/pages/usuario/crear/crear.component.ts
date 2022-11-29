import { Component, OnInit } from '@angular/core';
import { Usuario } from "../usuario.model";
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";
import { UsuarioService } from "src/app/core/services/usuario.service";
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidatorService } from "src/app/core/services/validator.service";

// Sweet Alert
import Swal from 'sweetalert2';

const regiones = [
  {id:1, nombre:"Arica y Parinacota"},
  {id:2,nombre: "Tarapacá" },
  {id:3,nombre: "Antofagasta" },
  {id:2,nombre: "Atacama" },
  {id:2,nombre: "Coquimbo" },
  {id:2,nombre: "Valparaíso" },
  {id:2,nombre: "Metropolitana de Santiago" },
  {id:2,nombre: "O'Higgins" },
  {id:2,nombre: "Maule" },
  {id:2,nombre: "Ñuble" },
  {id:2,nombre: "Biobío" },
  {id:2,nombre: "La Araucanía" },
  {id:2,nombre: "Los Ríos" },
  {id:2,nombre: "Los Lagos" },
  {id:2,nombre: "Aysén" },
  {id:2,nombre: "Magallanes" },
  {id:2,nombre: "Tarapacá" }];

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
    region:'',
    idRol:0,
    idHospital:0,
    correo:''
  }
  confirmarCorreoform:any;
  serviciosSalud: any[];
  roles:any[];
  regiones:any[];
  

  constructor(private restApiService:RestApiCheckService, 
    private validarService:ValidatorService,
    private formBuilder: UntypedFormBuilder, 
    private usuarioService: UsuarioService) { }
  
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
      idHospital:[this.usuario.idHospital, [Validators.required]],
      rut: [this.usuario.rut, [Validators.required,Validators.minLength(8)]],
      region:[this.usuario.region, [Validators.required]],
      confirmarCorreo: [this.confirmarCorreoform, [Validators.required, Validators.email]],
    })

    this.regiones = regiones;
    this.obtenerRoles()
    this.obtenerServiciosSalud();
  }

  get f() { return this.userForm.controls; }
  get correo() { return this.userForm.get('correo'); }
  get rut() { return this.userForm.get('rut'); }
  get nombre() { return this.userForm.get('nombre'); }
  get primerApellido() { return this.userForm.get('primerApellido'); }
  get segundoApellido() { return this.userForm.get('segundoApellido'); }
  get idRol() { return this.userForm.get('idRol'); }
  get idHospital() { return this.userForm.get('idHospital'); }
  get region() { return this.userForm.get('region'); }
  get confirmarCorreo() { return this.userForm.get('confirmarCorreo'); }

  obtenerRoles(){
    this.restApiService.getRoles().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res){
          
        }
        this.roles = [{id: 1,nombre:'Encargado de DiagnoChile'}]
        console.log(this.roles);
        
      }
    })
    this.roles = [{id: 1,nombre:'Encargado de DiagnoChile'}]
  }

  obtenerServiciosSalud(){
    this.restApiService.getHospitales().subscribe({
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

    let usuarioAux = {
      name: this.nombre.value + ' '+ this.primerApellido.value + ' '+this.segundoApellido.value,
      rut: this.rut.value,
      idHospital: this.idHospital.value,
      idRol: this.idRol.value,
      email: this.correo.value,
      password: "check.2022v1.0"
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
                
                this.successmsg('Usuario registrado','Se ha enviado un link al correo del usuario para establecer la contraseña.')
                this.userForm.reset
              },
              error:this.handleError.bind(this)
            })
          }else{
            this.modelTitle()
          }
        }, 
        error: (err)=>{ 
          this.modelTitle()
          console.log(err)}
    })
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

  modelTitle() {
    Swal.fire({
      title: 'Error',
      text: 'No se pudo crear el usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#364574',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes, delete it!'
    });
  }

  handleError(err){
    this.modelTitle()
    console.log(err);
    
  }

}
