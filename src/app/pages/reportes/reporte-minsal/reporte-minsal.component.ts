import { Component, OnInit,QueryList, ViewChildren, Renderer2, ElementRef, ViewChild } from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import * as XLSX from "xlsx";

// Sweet Alert
import Swal from 'sweetalert2';

// Date Format
import {DatePipe} from '@angular/common';

import {ListModel} from './list.model';
import { Orders } from './data';
import { ListService } from './list.service';
import { Examen } from './examen.model';
import { NgbdListSortableHeader, SortEvent } from './list-sortable.directive';

import { DatesService } from "src/app/core/services/dates.service";

// Rest Api Service
// import { ProductService } from "../../../core/services/rest-api.service";
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";
import { forEach } from 'lodash';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';


@Component({
  selector: 'app-reporte-minsal',
  templateUrl: './reporte-minsal.component.html',
  styleUrls: ['./reporte-minsal.component.scss'],
  providers: [ListService, DecimalPipe]
})
export class ReporteMinsalComponent implements OnInit {

   // bread crumb items
   breadCrumbItems!: Array<{}>;

   // Table data
   invoicesList!: Observable<ListModel[]>;
   total: Observable<number>;
   @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;
   @ViewChild('asTablaMinsal') invoiceTable!: ElementRef;
   @ViewChild('asHospitales') slcHospitales!: ElementRef;
   CustomersData!: ListModel[];
   masterSelected!:boolean;
   checkedList:any;
 
   // Api Data
   content?: any;
   econtent?: any;
   invoices?: any;
   headersList: string[];
   headersListVRS?: string[];
   headersListFLUV?: string[];
   examenes: any[]= [];
   virus:any[] = [
   {codigo:'72365-0',nombre:'Influenza A',columNombre:'FLUA',tipo:1},
   {codigo:'72365-0',nombre:'Influenza B',columNombre:'FLUB',tipo:0},
   {codigo:'SDB-0480',nombre:'Adenovirus',columNombre:'ADV',tipo:1},
   {codigo:'77390-3',nombre:'VIRUS SINCICIAL',columNombre:'VRS',tipo:1},
  ]
  today:Date= new Date();
  fechaInicio:any;
  fechaFin:any;
  fila:any= {
    anio: '',
      semana:'',
      examenes:{
        FLUA:{
          total:0,
          rangoEdadM:[0,0,0,0,0,0,0],
          rangoEdadF:[0,0,0,0,0,0,0]
        },
        FLUB: {
          total:0,
          rangoEdadM:[0,0,0,0,0,0,0],
          rangoEdadF:[0,0,0,0,0,0,0]
        },
        ADV:{
          total:0,
          rangoEdadM:[0,0,0,0,0,0,0],
          rangoEdadF:[0,0,0,0,0,0,0]
        },
        VRS:{
          total:0,
          rangoEdadM:[0,0,0,0,0,0,0],
          rangoEdadF:[0,0,0,0,0,0,0]
        },
        nombreHospital:''
      }
   
    }
    cargando:any = false;
    idHospital:any;
    centrosSalud:any[];
    serviciosSalud:any[];
    idServicio:any
    dataCentrosSalud:any[]
    disableHospital:boolean= true;
  
   constructor(private modalService: NgbModal,public service: ListService, private formBuilder: UntypedFormBuilder, private reporteService : RestApiCheckService, private datePipe: DatePipe, 
    private datesServices:DatesService, private tokenService: TokenStorageService) {
    let currentUser = this.tokenService.getUser()
    this.idHospital = currentUser.idHospital

     this.invoicesList = service.countries$;
     this.total = service.total$;
     this.headersList = ["Establecimiento","Responsable de notificacion","Semana epidemiológica","VRS","FLUA ","FLUB", "ADV",	"PARAFLU 1"	,"MPV",	"VRS H < 1 año",	"VRS H 1 - 4 años",	"VRS H 5 - 14 años",	"VRS H 15 -54 años",
      "VRS H 55 - 64 años","VRS H > 65 años","VRS M < 1 año",	"VRS M  1 - 4 años",	"VRS M  5 - 14 años",	"VRS M 15 -54 años ",	"VRS M  55 - 64 años",	"VRS M  > 65 años",	"FLU A H < 1 año",	"FLU A H 1 - 4 años",
     	"FLU A H 5 - 14 años",	"FLU A H 15-54 años", 	"FLU A H 56 - 64 años", "FLU A H > 65 años",	"FLU A M < 1 año",	"FLU A M 1- 4 años",	"FLU A M 5- 14 años",
    	"FLU A M 15 -54 años", 	"FLU A M 55 - 64 años",	"FLU A M > 65 años",	"FLU B H < 1 año",	"FLU B H 1 - 4 años",
      "FLU B H 5 - 14 años",	"FLU B H 15-54 años", 	"FLU B H 56 - 64 años", "FLU B H > 65 años",	"FLU B M < 1 año",	"FLU B M 1- 4 años",	"FLU B M 5- 14 años",
     "FLU B M 15 -54 años", 	"FLU B M 55 - 64 años",	"FLU B M > 65 años","ADV H < 1 años",	"ADV H 1 - 4 años",	"ADV H 5 - 14 años",	"ADV H 15 -54 años","ADV H 55 - 64 años",
    	"ADV H > 65 años",	"ADV M < 1 año",	"ADV M  1 - 4 años","ADV M  5 - 14 años",	"ADV M  15 -54 años",	"ADV M  55 - 64 años",	"ADV M  > 65 años",	"P1 H < 1 año",	"P1 H  1 - 4 años",	"P1 H  5 - 14 años	",
      "P1 H  15 -54 años", 	"P1 H  55 - 64 años",	 "P1 H  > 65 años",	"P1 M  < 1 años",	"P1 M 1 - 4 años3",	"P1 M 5 - 14 años", 	"P1 M 15 -54 años",  	"P1 M 55 - 64 años", 	"P1 M > 65 años", 	"P2 H < 1 año3",	
      "P2 H  1 - 4 años",	"P2 H 5 - 14 años", 	"P2 H  15 -54 años",  	"P2 H  55 - 64 años",	"P2 H  > 65 años", 	"P2 M < 1 año", 	"P2 M 1 - 4 años", 	"P2 M 5 - 14 años" , 	"P2 M 15 -54 años", 	"P2 M 55 - 64 años",  	
      "P2 M > 65 años",  	"P3 H < 1 año5",	"P3 H 1 - 4 años",	"P3 H  5 - 14 años" , 	"P3 H  15 -54 años" , 	"P3 H 55 - 64 años" ,	"P3 H > 65 años",	"P3 M < 1 año6",	"P3 M  1 - 4 años",	"P3 M 5 - 14 años", 
      	"P3 M  15 -54 años",	"P3 M  55 - 64 años", 	"P3 M  > 65 años",	"MPV H < 1 año",	"MPV H  1 - 4 años", 	"P3 H 5 - 14 años",	"MPV H 15 -54 años",  	"MPV H  55 - 64 años", "	MPV H > 65 años", "MPV M < 1 año",	
        "MPV M  1 - 4 años",	"MPV M  5 - 14 años", 	"MPV M  15 -54 años",	"MPV M 55 - 64 años", 	"MPV M  > 65 años" ];
     
      this.fechaFin = this.changeDate(this.today);
      let fechaAux = this.datesServices.getDayOfCurrentWeek(new Date(),1)
      this.fechaInicio = this.changeDate(fechaAux);
      // this.fechaFin = '2022/10/30'
      // this.fechaInicio = '2022/10/24'
   }
 
   ngOnInit(): void {
     /**
     * BreadCrumb
     */
      this.breadCrumbItems = [
       { label: 'Reportes' },
       { label: 'MINSAL', active: true }
     ];
 
     /**
      * fetches data
      */
    //   this.invoicesList.subscribe(x => {
    //    this.content = this.invoices;
    //    this.invoices =  Object.assign([], x);   
    //  });
    this.obtenerHospitales();
    this.obtenerServiciosSalud()
    this.consultaReporteMinsal(this.fechaInicio, this.fechaFin)
    // this.consultaReporteMinsal('24/10/2022', '30/10/2022')
    //  this.reporteService.createHospital('Hospital TEST').subscribe({
    //   next: (res:any)=>{
    //     console.log(res);
    //   },
    //   error:this.handleError.bind(this)
    //  })
   }

   obtenerHospitales(){
    this.reporteService.getHospitales().subscribe({
      next:(res:any)=>{
        if(res.length){
          this.dataCentrosSalud = res
        }
      }
    })
   }
   obtenerServiciosSalud(){
    this.reporteService.getServiciosSalud().subscribe({
      next:(res:any)=>{
        // console.log(res);
        if(res.length){
          this.serviciosSalud = res
        }
      }
    })
  }

   consultaReporteMinsal(fechaInicio:string, fechaFin:string){
      console.log(fechaInicio,fechaFin);
      let fechaInicioAux = this.formatFecha(fechaInicio);
      let fechaFinAux= this.formatFecha(fechaFin);
      if(fechaFin< fechaInicio){
        alert('La fecha de termino debe ser mayor a la fecha de inicio');
        return;
      }
      if ( this.fechaInicio == '' ||this.fechaFin == '') {
        alert("las fechas no son válidas.")
        return
      }

      this.cargando = true;
    this.reporteService.getReporteMinsal(fechaInicioAux,fechaFinAux,this.idHospital).subscribe({
      next: async (res:any)=>{
        console.log(res);
        let resp:any = res;
        let filaAux:any = this.fila
        this.examenes = []
        if(res.data.length > 0){
          this.examenes = this.formatearDatos(res.data)

          
          // this.examenes = this.formatearDatos(this.dataEx)
        }
        this.cargando = false;
       
      },
      error:this.handleError.bind(this)
     })
   }

   formatearDatos(data:Examen[]){
    console.log(data);
    let dataAux:any[] = []
    
    data.forEach((elem,i)=>{
      let filaAux:any = {}
       filaAux = { 
        hospital: elem.nombreHospital,
        servicioSalud:elem.nombreServicioSalud,
        encargado: elem.encargadoLab,
        anio: '',
       semana:'',
       examenes:{
         FLUA:{
           total:0,
           rangoEdadM:[0,0,0,0,0,0,0],
           rangoEdadF:[0,0,0,0,0,0,0]
         },
         FLUB: {
           total:0,
           rangoEdadM:[0,0,0,0,0,0,0],
           rangoEdadF:[0,0,0,0,0,0,0]
         },
         ADV:{
           total:0,
           rangoEdadM:[0,0,0,0,0,0,0],
           rangoEdadF:[0,0,0,0,0,0,0]
         },
         VRS:{
           total:0,
           rangoEdadM:[0,0,0,0,0,0,0],
           rangoEdadF:[0,0,0,0,0,0,0]
         },
         nombreHospital:''
       }
    }

      let ind = dataAux.findIndex((item)=> { return item.anio == elem.annio && item.semana == elem.semana} )
      let nombreExamen = elem.estado.split('^')
      let iVirus;
      if (elem.resultado == '72365-0') {
        let tipo = nombreExamen[1].indexOf('A')
        if(tipo != -1){
          iVirus = this.virus.findIndex((object)=> object.codigo == elem.resultado && object.tipo == 1)
        }else{
          iVirus = this.virus.findIndex((object)=> object.codigo == elem.resultado && object.tipo == 0)
        }
      }else{
        iVirus = this.virus.findIndex((object)=> object.codigo == elem.resultado)
      }
       
      let column = '';
      let edad = parseInt(elem.edad)
      let resul = false;
      let iEdad = this.validarEdad(edad)
      if (iVirus != -1) {
        let column = this.virus[iVirus].columNombre

        if((elem.tipoExamen == "CWE" && elem.estado.indexOf('positive')!= -1)|| (elem.tipoExamen.length == 0 && elem.estado== "A")){
          resul =true;
        }
        if (ind != -1) {
            if(resul){
              if(elem.genero == 'M'){
                dataAux[ind].examenes[column].rangoEdadM[iEdad] ++;
              } else {
                dataAux[ind].examenes[column].rangoEdadF[iEdad] ++;
              }
              console.log(dataAux[ind].examenes[column].rangoEdadF[iEdad]); 
            }
            dataAux[ind].examenes[column].total ++;
        }else{
          filaAux.anio = elem.annio;
          filaAux.semana = elem.semana;
          if(resul){
            if(elem.genero == 'M'){
              filaAux.examenes[column].rangoEdadM[iEdad] ++;
            } else {
              let iEdad = this.validarEdad(edad)
              filaAux.examenes[column].rangoEdadF[iEdad] ++;
            }
          }
          filaAux.examenes[column].total ++;
          dataAux.push(filaAux)
        }
      }
      
    })
    console.log(dataAux);
    
    return dataAux
   }
   validarEdad(edad:number){
    let i= 0;
    if(edad == 0){
      i = 0
    }else if (edad > 0 && edad < 5) {
      i = 1
    } else if (edad > 4 && edad < 15) {
      i = 2
    } else if (edad > 14 && edad < 55) {
      i = 3
    } else if (edad > 54 && edad < 65) {
      i = 4
    } else if (edad > 64) {
      i = 5
    }
    return i
   }
   filtrarControlHospitales(){
    //console.log(this.idServicio, this.idRol.value, typeof(this.idRol.value));
    if(this.idServicio != ''){
      this.disableHospital = false
      this.centrosSalud = this.dataCentrosSalud.filter(elem => {
        return (elem.fkServicioSalud).toString() == this.idServicio
      })
    }else{
      this.centrosSalud = []
      this.disableHospital = true
    }
  }
   handleError(error:any){
    console.log(error);
    this.cargando = false;
   }
 
   formatFecha(fecha:any){
      fecha = fecha.toString().replace(/\-/g,'/')
      let fechaAux = fecha.split('/')
      let fechaRes: string = fechaAux[2] +'/'+fechaAux[1]+'/'+fechaAux[0]
      return fechaRes
   }

   changeDate(date:Date){
    let dia = (date.getDate()<10)? '0'+date.getDate(): date.getDate();
    let mes = ((date.getMonth()+1)<10)? '0'+(date.getMonth()+1): date.getMonth()+1;
    let anio = date.getFullYear()
    return anio+'-'+mes+'-'+dia
  }
    /**
    * Confirmation mail model
    */
     deleteId: any;
     confirm(content:any,id:any) {
       this.deleteId = id;
       this.modalService.open(content, { centered: true });
     }
 
   // Delete Data
   deleteData(id:any) {    
    //  if(id){
    //    this.ProductService.deleteInvoice(id).subscribe({
    //      next: data => { },
    //      error: err => {
    //        this.content = JSON.parse(err.error).message;
    //      }
    //    });
    //    document.getElementById('i_'+id)?.remove();
    //  }
    //  else{
    //    this.checkedValGet.forEach((item:any)=>{
    //      document.getElementById('i_'+ item)?.remove();      
    //    });
    //  }
   }
 
   /**
    * Multiple Delete
    */
   checkedValGet: any[] = [];
   deleteMultiple(content:any){
     var checkboxes:any = document.getElementsByName('checkAll');
     var result
     var checkedVal: any[] = [];
     for (var i = 0; i < checkboxes.length; i++) {
       if (checkboxes[i].checked) {
           result = checkboxes[i].value;
           checkedVal.push(result);   
       }
     }
     if(checkedVal.length > 0){
       this.modalService.open(content, { centered: true });
     }
     else{
       Swal.fire({text:'Please select at least one checkbox',confirmButtonColor: '#29badb',});
     }
     this.checkedValGet = checkedVal;
   }
 
   // The master checkbox will check/ uncheck all items
   checkUncheckAll(ev:any) {    
     this.invoices.forEach((x: { state: any; }) => x.state = ev.target.checked)
   }
 
   // Filtering
   isstatus?:any
   SearchData(){
     var status = document.getElementById("idStatus") as HTMLInputElement;   
     var date = document.getElementById("isDate") as HTMLInputElement; 
     var dateVal = date.value ? this.datePipe.transform(new Date(date.value),"yyyy-MM-dd"):'';        
     if(status.value != 'all' && status.value != '' || dateVal != ''){
       this.invoices = this.content.filter( (list:any) => {
         return this.datePipe.transform(new Date(list.date),"yyyy-MM-dd") == dateVal || list.status === status.value;
       });  
     }
     else{
       this.invoices = this.content;
     }
   }

   exportExcel(): void 
    {
      let fileName = "reporte_minsal.xlsx"
       /* table id is passed over here */   
       //let element = document.getElementById('excel-table'); 
       let element = this.invoiceTable.nativeElement;
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, fileName);
    }
}

 

