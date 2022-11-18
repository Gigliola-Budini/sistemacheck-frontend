import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";

import { UntypedFormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { data } from "./../data";
import {Muestra} from "./examen.model"
import { Examen } from '../../reportes/reporte-minsal/examen.model';

interface SearchResult {
  examenes: Examen[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: '';
  sortDirection: '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(countries: Muestra[], column: any, direction: string): any[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  // bread crumb items
  @ViewChild('asDetalle') detalle: ElementRef;
  @ViewChild('astablaExamenes') tablaExamenes: ElementRef;
  dataOptions: DataTables.Settings;
  breadCrumbItems!: Array<{}>;
  date:Date = new Date();
  examenes?: Muestra[] =[];
  dataExamenes?: Muestra[] =[];
  today:Date= new Date();
  fechaInicio:any ;
  fechaFin:any;
  cargando:any= false;

  virus:any[]= [{ codigo:'72365-0',nombre:'Influenza'},
  { codigo:'77390-3',nombre:'Sincicial'},
  { codigo:'SDB-0480',nombre:'Adenovirus'}
]
  state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0
  };
  total$ = 0
  loading = false;
  page= this.state.page
  pageSize= this.state.pageSize
  searchTerm=this.state.searchTerm
  startIndex=this.state.startIndex
  endIndex=this.state.endIndex
  totalRecords = this.state.totalRecords

  constructor(private restApiService:RestApiCheckService,private renderer: Renderer2,private modalService: NgbModal) { 
    this.fechaFin = this.formatDate(this.today);
    let fechaAux = new Date()
    fechaAux.setDate(this.today.getDate()-7)
    this.fechaInicio = this.formatDate(fechaAux);
    console.log(this.fechaInicio, this.fechaFin);
    
  }

  detalleExamen?: Muestra;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Exámenes' },
      { label: 'Listado', active: true }
    ];
    
    this.dataOptions = {
     
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
    this.obtenerExamenesFecha(this.fechaInicio,this.fechaFin)
    
    console.log(this.examenes);
  }

  formatDate(date:Date){
    let dia = (date.getDate()<10)? '0'+date.getDate(): date.getDate();
    let mes = ((date.getMonth()+1)<10)? '0'+(date.getMonth()+1): date.getMonth()+1;
    let anio = date.getFullYear()
    return anio+'-'+mes+'-'+dia
  }

  cambiarFecha(date:string){
    let fechaAux = date.split('-')
    return fechaAux[2] +'/'+fechaAux[1] +'/'+fechaAux[0]
  }


  obtenerExamenesFecha(inicio:any, fin:any){
    console.log(inicio,fin);
    if(this.fechaInicio > this.fechaFin || this.fechaInicio == '' ||this.fechaFin == ''){
      alert("Rango de fechas no válido");
      return;
    }
    this.cargando = true;
    this.restApiService.getExamenes(this.cambiarFecha(inicio),this.cambiarFecha(fin)).subscribe({
      next:(res:Muestra[])=>{
        console.log(res);
        if(res.length > 0){
          this.examenes = res;
          // this.examenes = this.search(this.dataExamenes)
        }else{
          this.examenes = []
        }
        this.cargando= false;
      },
    error:(err)=>{
      console.log(err);
      this.cargando= false;

    }})
  }

  mostrarDetalleExamen(event,content:any ,i){
    console.log(event);

    this.detalleExamen = this.examenes[i];
    this.modalService.open(content, { size: 'lg',centered: true });
    // var detalleExamen = this.detalle.nativeElement;
    // var tabla = this.tablaExamenes.nativeElement;
  }
  getNombre(examen, resul){
    let arrNombre = examen.split('^')
    let i:any = this.virus.findIndex((elem)=>{
      return elem.codigo == arrNombre[0]
    })
    let elem = this.virus[i]
    // console.log(resul.indexOf('A'));
    if (elem.codigo == '72365-0' && (resul.indexOf(' A ') != -1)) {
      return elem.nombre + ' A'
    }else if(elem.codigo == '72365-0'){
      return elem.nombre + ' B'
    }
    
    return elem.nombre;
  }

  getResult(result){
    if(result == "A" || result.indexOf('positive')!= -1){
      return 'Positivo'
    }else{
      return 'Negativo'
    }
  }

  search(examenes){
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this.state;

    // 1. sort
    let examenesArr = sort(examenes, sortColumn, sortDirection);

    // 2. filter
    // countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    const total = examenesArr.length;

    // 3. paginate
    this.totalRecords = examenesArr.length;
    this.state.startIndex = (page - 1) * this.pageSize + 1;
    this.state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    examenesArr = examenesArr.slice(this.state.startIndex - 1, this.state.endIndex);
    // return ({examenesArr, total});
    return examenesArr;
  }

}
