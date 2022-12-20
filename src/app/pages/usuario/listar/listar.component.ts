import { Component, OnInit } from '@angular/core';
import { Usuario } from "../usuario.model";

import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { RestApiCheckService } from 'src/app/core/services/rest-api-check.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { DataTablesModule } from "angular-datatables";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {
  dtOptions: DataTables.Settings;
  breadCrumbItems!: Array<{}>;
  cargando:boolean = false;
  usuarios:Usuario[];
  isAdmin:boolean = false;
  currentUser :any
  hospitales: any[] =[]; 
  idHospital : any;

  constructor(private tokenService: TokenStorageService,private restApiService:RestApiCheckService,private usuarioService:UsuarioService) { 
    let currentUser = this.tokenService.getUser()
    if(currentUser.rol == 'Encargado de DiagnoChile'){
      this.isAdmin = true
    }
  }

  ngOnInit(): void {
    
    this.breadCrumbItems = [
      { label: 'Usuarios' },
      { label: 'Listado', active: true }
    ];
    this.obtenerUsuarios()
    this.obtenerServiciosSalud()
    
    
    this.dtOptions = {
     
      language: {
        "lengthMenu": "Mostrar _MENU_ registros por página",
        "zeroRecords": "No se encontraron resultados - lo sentimos",
        "info": "Mostrando página _PAGE_ de _PAGES_",
        "infoEmpty": "No hay registros disponibles",
        "infoFiltered": "(filtrado de _MAX_ registros totales)",
        "paginate": {
          "first":"Primera",
          "next": "Siguiente",
          last:"Última",
          previous:"Anterior",
        },
        "search":"Buscar"     
        
      }
    };
  }

  obtenerServiciosSalud(){
    this.restApiService.getHospitales().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.length >=1 ){
          this.hospitales = res
        }
      }
    })
  }
  obtenerUsuarios(){
    this.cargando = true;
    this.usuarioService.getUsuariosHospital(1).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.length>=1){
          this.usuarios= res
        }else{
          this.usuarios = []
        }
        this.cargando = false;
      },error:(err)=>{
        console.log(err);
        this.cargando = false;
      }
    })
  }
}
