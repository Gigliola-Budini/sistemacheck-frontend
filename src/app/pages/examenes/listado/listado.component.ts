import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";

import { UntypedFormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { data } from "./../data";
import {Muestra} from "./examen.model"
import { Examen } from '../../reportes/reporte-minsal/examen.model';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  // bread crumb items
  @ViewChild('asDetalle') detalle: ElementRef;
  @ViewChild('astablaExamenes') tablaExamenes: ElementRef;
  breadCrumbItems!: Array<{}>;
  date:Date = new Date();
  examenes?: Muestra[] =[];
  today:Date= new Date();
  fechaInicio:any ;
  fechaFin:any;
  cargando:any= false;

  virus:any[]= [{ codigo:'72365-0',nombre:'Influenza'},
  { codigo:'77390-3',nombre:'Sincicial'},
  { codigo:'SDB-0480',nombre:'Adenovirus'}
]
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

}
