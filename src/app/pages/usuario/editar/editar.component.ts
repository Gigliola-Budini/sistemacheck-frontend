import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiCheckService } from 'src/app/core/services/rest-api-check.service';
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
      idHospital:[this.usuario.idHospital, [Validators.required]],
      rut: [this.usuario.rut, [Validators.required,Validators.minLength(8)]],
      idServicio:[this.usuario.idServicio, [Validators.required]],

    })
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

}
