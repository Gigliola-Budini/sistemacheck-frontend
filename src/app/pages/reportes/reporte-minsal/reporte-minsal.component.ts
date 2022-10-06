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
import { NgbdListSortableHeader, SortEvent } from './list-sortable.directive';

// Rest Api Service
// import { ProductService } from "../../../core/services/rest-api.service";
import { RestApiCheckService } from "src/app/core/services/rest-api-check.service";
import { forEach } from 'lodash';


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
   hospitales?: any[];
   examenes: any[]= [];
   virus:any[] = [{codigo:'LA19020-9',nombre:'Influenza B virus negative',columNombre:'FLUB',tipo:0},
   {codigo:'LA19017-5',nombre:'Influenza A virus positive',columNombre:'FLUA',tipo:1},
   {codigo:'LP14061-3',nombre:'Adenovirus',columNombre:'ADV',tipo:1},
   {codigo:'',nombre:'VIRUS SICICIAL',columNombre:'VRS',tipo:1}

  ]
 
   constructor(private modalService: NgbModal,public service: ListService, private formBuilder: UntypedFormBuilder, private reporteService : RestApiCheckService, private datePipe: DatePipe) {
     this.invoicesList = service.countries$;
     this.total = service.total$;
     this.headersList = ["Establecimiento","Responsable de notificacion","Semana epidemiológica","VRS","FLUA FLUB", "ADV",	"PARAFLU 1"	,"MPV",	"VRS H < 1 año",	"VRS H 1 - 4 años",	"VRS H 5 - 14 años",	"VRS H 15 -54 años",
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
      this.hospitales = [{idHospital:'2',nombre:'San Fernando'}]  

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
      this.invoicesList.subscribe(x => {
       this.content = this.invoices;
       this.invoices =  Object.assign([], x);   
     });

     this.reporteService.getReporteMinsal('01/01/2022','30/12/2022').subscribe({
      next: async (res:any)=>{
        console.log(res);
        let resp:any = res;
        let fila:any = {
          semana:'',
          FLUA:{
            total:0,
            rangoEdadM:{},
            rangoEdadF:{}
          },
          FLUB: {
            total:0,
            rangoEdadM:{},
            rangoEdadF:{}
          },
          ADV:{
            total:0,
            rangoEdadM:{},
            rangoEdadF:{_1: 0,
              "_1-4": 0,
              "_15-54": 0,
              "_5-14": 0,
              "_55-64": 0,
              _65: 0,
              total: 0}
          },
          VRS:{
            total:0,
            rangoEdadM:{_1: 0,
              "_1-4": 0,
              "_15-54": 0,
              "_5-14": 0,
              "_55-64": 0,
              _65: 0,
              total: 0},
            rangoEdadF:{_1: 0,
              "_1-4": 0,
              "_15-54": 0,
              "_5-14": 0,
              "_55-64": 0,
              _65: 0,
              total: 0}
          },
          nombreHospital:''
        }
       
        for (const elem in resp) {
          // console.log(elem);
          
          fila.semana = elem.replace('_','')
          // console.log(resp[elem]);
          let examen:any = {}
          for (const key in resp[elem][0]) {
            if (Object.prototype.hasOwnProperty.call(resp[elem][0], key)) {
              const element = resp[elem][0][key];
              console.log(element,key);
              let resulVirus= {}
              let genero = key.substring(key.length-1,key.length)
              let i = this.virus.findIndex((object)=> object.codigo == key.substring(0,key.length-2))
              // console.log(typeof(element));
              
              if(typeof(element) != 'string'){
                if (this.virus[i].tipo = 1) {
                  if (genero == 'M') {
                    fila[this.virus[i].columNombre].rangoEdadM = element
                    fila[this.virus[i].columNombre].total = parseInt(fila[this.virus[i].columNombre].total) + parseInt(element.total)
                  }else{
                    fila[this.virus[i].columNombre].rangoEdadF = element
                    fila[this.virus[i].columNombre].total =parseInt(fila[this.virus[i].columNombre].total) + parseInt(element.total)
                  }
                }else{
                  fila[this.virus[i].columNombre].total =parseInt(fila[this.virus[i].columNombre].total) + parseInt(element.total)
                }
              }else{
                fila.nombreHospital = element
              }
              
              console.log(fila);
              
              // await this.reporteService.getNameVirus(key.substring(0,key.length-2)).subscribe({
              //   next: (res:any)=>{
              //     console.log(res);
                  
              //     if(key == 'LA19020-9'){
              //       if(genero = 'M'){

              //       }
              //     }
              //   }
              // })
              
            }
          }
           this.examenes?.push(fila);
        }
      },
      error:this.handleError.bind(this)
     })
    //  this.reporteService.createHospital('Hospital TEST').subscribe({
    //   next: (res:any)=>{
    //     console.log(res);
        
        
    //   },
    //   error:this.handleError.bind(this)
    //  })
   }

   handleError(error:any){
    console.log(error);
    
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

 

