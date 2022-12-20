import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiCheckService } from 'src/app/core/services/rest-api-check.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
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
  centrosSalud: any[];
  roles:any[];
  serviciosSalud:any[];
  dataCentrosSalud:any[];
  centrolSalud:any=[]
  isAdmin:boolean;

  constructor(private restApiService:RestApiCheckService, 
    private validarService:ValidatorService,
    private formBuilder: UntypedFormBuilder, 
    private usuarioService: UsuarioService,
    private router: Router,
    private tokenService: TokenStorageService) { 
      let user =this.tokenService.getUser()
      console.log(user);
      
      if(user.rol == "Encargado de DiagnoChile"){
        this.isAdmin = true
      }
    }


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Usuarios' },
      { label: 'Crear', active: true }
    ];
    this.userForm =  this.formBuilder.group({
      correo: [{value:this.usuario.correo,disabled:true}, [Validators.required, Validators.email]],
      // rut: [this.user.rut, [Validators.required]],
      nombre:[this.usuario.nombre, [Validators.required]],
      primerApellido:[this.usuario.primerApellido,  [Validators.required]],
      segundoApellido:[this.usuario.segundoApellido, [Validators.required]],
      idRol:[{value:this.usuario.idRol,disabled:true}, [Validators.required]],
      idHospital:[{value:this.usuario.idHospital,disabled:true}, [Validators.required]],
      rut: [this.usuario.rut, [Validators.required,Validators.minLength(8)]],
      idServicio:[{value:this.usuario.idServicio,disabled:true}, [Validators.required]],

    })
    this.obtenerServiciosSalud()
    this.obtenerRoles()
    this.obtenerCentrosSalud()
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


  editarUsuario(){
    
  }

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
  switchControles(control){
    if(this.f[control].disabled){
      this.f[control].enable()
    }else{
      this.f[control].disable()
    }
  }

}
