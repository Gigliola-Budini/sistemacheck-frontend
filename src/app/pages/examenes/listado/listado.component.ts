import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { data } from "./../data";
import {Muestra} from "./examen.model"

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
  today?:string ;
  examenes?: Muestra[];
  virus:any[]= [{ codigo:'72365-0',nombre:'Influenza'},
  { codigo:'77390-3',nombre:'Sincicial'},
  { codigo:'SDB-0480',nombre:'Adenovirus'}
]
  constructor(private restApiService:RestApiCheckService,private renderer: Renderer2,private modalService: NgbModal) { 
    this.today = this.date.getDate()+'/'+this.date.getMonth+'/'+this.date.getFullYear();
  }

  detalleExamen?: Muestra;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Exámenes' },
      { label: 'Listado', active: true }
    ];
    
    this.obtenerExamenesFecha('01/01'+this.date.getFullYear(),this.today)
    
    console.log(this.examenes);
    
  }

  obtenerExamenesFecha(inicio:any, fin:any){
    this.restApiService.getExamenes(inicio,fin).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.length > 0){
          this.examenes = data;
        }else{
          this.examenes = []
        }

      },
    error:(err)=>{
      console.log(err);
      

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
