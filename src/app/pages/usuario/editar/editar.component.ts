import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import {  Router, ActivatedRoute } from '@angular/router';
import { RestApiCheckService } from 'src/app/core/services/rest-api-check.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import Swal from 'sweetalert2';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  breadCrumbItems:Array<{}>;
  userForm : UntypedFormGroup;
  idUsuario:any;
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
  habilitado: number;
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
    private tokenService: TokenStorageService,
    private route: ActivatedRoute) { 
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

    this.idUsuario = this.route.snapshot.paramMap.get('id');

    this.userForm =  this.formBuilder.group({
      correo: [{value:this.usuario.correo,disabled:true}, [Validators.required, Validators.email]],
      nombre:[this.usuario.nombre, [Validators.required]],
      primerApellido:[this.usuario.primerApellido,  [Validators.required]],
      segundoApellido:[this.usuario.segundoApellido, [Validators.required]],
      idRol:[{value:this.usuario.idRol,disabled:true}, [Validators.required]],
      idHospital:[{value:this.usuario.idHospital,disabled:true}, [Validators.required]],
      rut: [{value:this.usuario.rut,disabled:true}, [Validators.required,Validators.minLength(8)]],
      idServicio:[{value:this.usuario.idServicio,disabled:true}, [Validators.required]],

    })
    
    this.obtenerServiciosSalud()
    this.obtenerRoles()
    this.obtenerCentrosSalud()
    this.obtenerUsuarioId()
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

  //{ “rut”:string,"idRol":int, "idHospital":int, "name":string, “email":string }
  editarUsuario(){
    if(!this.userForm.valid){
      return;
    }

    let usuarioAux={
      rut: this.rut.value,
      name:this.nombre.value,
      email: this.correo.value,
      idHospital: this.idHospital.value,
      idRol: this.idRol.value,
      apellidoP:this.primerApellido.value,
      apellidoM:this.segundoApellido.value,
    }
    this.usuarioService.editUsuario(usuarioAux).subscribe({
      next:(res:any)=>{
        if(res.length){
          
          this.timermsg('Muy bien','El usuario ha sido editado')
        }else{
          Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})
        }
        console.log(res);
        
      },error:(err)=>{
        console.log(err);
        Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})
      },})
  }

  obtenerUsuarioId(){
    this.usuarioService.getUsuarioId(this.idUsuario).subscribe({
      next: (res:any)=>{
        if(res.length ==1){
          let usu  = res[0]
          this.f['idServicio'].setValue(usu.idServicioSalud)
          this.centrosSalud = this.dataCentrosSalud.filter(elem => {
            return elem.fkServicioSalud == this.idServicio.value
          })
          this.f['rut'].setValue(usu.rut)
          this.f['idRol'].setValue(usu.rol)
          this.f['idHospital'].setValue(usu.idhospital)
          this.f['correo'].setValue(usu.email)
          this.f['nombre'].setValue(usu.nombre)
          this.f['primerApellido'].setValue(usu.apellidoP)
          this.f['segundoApellido'].setValue(usu.apellidoM)
          this.habilitado = usu.estado 
          console.log(usu.estado, this.habilitado);
        }
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  async obtenerRoles(){
    await this.restApiService.getRoles().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res){
          this.roles = res
        }
       
        
      }
    })
    // this.roles = [{id: 1,nombre:'Encargado de DiagnoChile'}]
  }

  async obtenerCentrosSalud(){
    await this.restApiService.getHospitales().subscribe({
      next:(res:any)=>{
        if(res.length){
          this.dataCentrosSalud = res
        }
      }
    })
  }

  async obtenerServiciosSalud(){
    await this.restApiService.getServiciosSalud().subscribe({
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

  deshabilitarUsuario(){
    this.confirm('¿Deseas deshabilitar este usuario?',0);
  }
  habilitarUsuario(){
    this.confirm('¿Deseas habilitar este usuario?',1);
  }
//'¿Deseas deshabilitar este usuario?'
  confirm(msg, estado) {
    Swal.fire({
      title: msg,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#364574',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Sí'
    }).then(result => {
      if (result.value) {
        this.usuarioService.enableDisableUsuario(parseInt(this.idUsuario), estado)
        .subscribe({next:
          (res:any)=>{
            if (res== 'OK') {
              console.log(res);
              Swal.fire({title: 'Cambios Guardados', text:'', confirmButtonColor: '#364574', icon: 'success',})
              this.obtenerUsuarioId();
            }else{
            Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})
            }
          }, error:(err)=>{
            console.log(err);
            Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})
          }})
        
      }
    });
  }

  ajax(msg,estado) {
    Swal.fire({
      title: msg,
      showCancelButton: true,
      icon:'warning',
      confirmButtonText: 'Sí',
      showLoaderOnConfirm: true,
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      allowOutsideClick: false,
    }).then((res) => {
        this.usuarioService.enableDisableUsuario(parseInt(this.idUsuario), estado)
        .subscribe({next:
          (res:any)=>{
            if (res== 'OK') {
              console.log(res);
              Swal.fire({title: 'Cambios Guardados', text:'', confirmButtonColor: '#364574', icon: 'success',})
              this.obtenerUsuarioId();
            }else{
            Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})
            }
          }, error:(err)=>{
            console.log(err);
            
            Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})

          }})
          
    }).catch(err => {
      Swal.fire({title: 'Error', text:'No se pudo realizar el cambio', confirmButtonColor: '#364574', icon: 'error',})
    });;
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
    this.router.navigate(['/usuarios/listar'])
    if (result.dismiss === Swal.DismissReason.timer) {
    
    }
  });
}
}
