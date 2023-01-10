import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { tileLayer, latLng, circle } from 'leaflet';
import { ChartType } from './dashboard.model';
import { SwiperDirective, SwiperComponent } from 'ngx-swiper-wrapper';
import { SwiperOptions } from 'swiper';
import { BestSelling, TopSelling, RecentSelling, statData } from '../../dashboards/dashboard/data';
import { RestApiCheckService } from 'src/app/core/services/rest-api-check.service';
import { DatesService } from "src/app/core/services/dates.service";

interface State {
    title:  string;
    value: number,
    icon: string //'bx-dollar-circle',
    persantage: string,
    profit: string //'up' - 'down' - 'equal'
}

const data = [{
  nombre:"sincicial",
  semana: 42,
  positivos:24,
  negativos:40
},{
  nombre:"sincicial",
  semana: 43,
  positivos:24,
  negativos:40
},{
  nombre:"influenza",
  semana: 42,
  positivos:24,
  negativos:40
},{
  nombre:"influenza",
  semana: 43,
  positivos:24,
  negativos:40
},{
  nombre:"adenovirus",
  semana: 42,
  positivos:24,
  negativos:40
},{
  nombre:"adenovirus",
  semana: 43,
  positivos:24,
  negativos:40
}]

const virus = ['Influenza A','Influenza B', 'Sincicial', 'Adenovirus']
@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.scss']
})
export class IndicadoresComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  analyticsChart!: ChartType;
  BestSelling: any;
  TopSelling: any;
  RecentSelling: any;
  SalesCategoryChart!: ChartType;
  statData!: any;
  splineAreaChart:any;
  categorias = []
  valorMax=0
  total = 0
  totalPositivos= 0
  totalNegativos= 0
  cargando: boolean=  false
  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;

  constructor(private respApiService: RestApiCheckService, private dateService:DatesService) { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
     this.breadCrumbItems = [
      { label: 'Panel de Control' },
      { label: 'Indicadores', active: true }
    ];
    

     /**
     * Fetches the data
     */
      // this.fetchData();
    let hoy = this.dateService.formatFechaEsp(new Date());
    let ultimoDomingo= this.dateService.formatFechaEsp(this.dateService.getDayOfCurrentWeek(new Date(),0))
    let tresMeses= this.dateService.formatFechaEsp(this.dateService.sumarDias(new Date(), -90))
    // Chart Color Data Get Function
    this._analyticsChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    this._splineAreaChart('["--vz-success", "--vz-danger","--vz-primary"]',[]);
    this.obtenerDatosIndicadores(ultimoDomingo,hoy)
    this.obtenerDatosGraficos(tresMeses,hoy)
    this.obtenerDatosIndicadoresEtereos('27/01/2022','8/01/2023')
   
  }

  formatoFechaEsp(date:Date){
    
  }
  obtenerDatosIndicadores(fechaIni,fechaFin){
    // this.cargando = true
    this.respApiService.getIndicadores(fechaIni,fechaFin).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.data){
          //this.statData = statData2
         this.statData = this.setStateVirus(res.data[0].virus)
        
        }
      }, error:(err)=>{
        console.log(err);
        // this.cargando = false;
      }
    })
  }
  obtenerDatosGraficos(fechaIni,fechaFin){
    this.cargando = true
    this.respApiService.getIndicadores(fechaIni,fechaFin).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.data){
          //this.statData = statData2
         let dataGrafico = this.distribuirData(res.data[0].virus)
         this._splineAreaChart('["--vz-success", "--vz-danger", "--vz-warning", "--vz-primary", "--vz-secondary"]',dataGrafico);
        }
      }, error:(err)=>{
        console.log(err);
        this.cargando = false
      }
    })
  }
  obtenerDatosIndicadoresEtereos(fechaIni,fechaFin){
    this.respApiService.getIndicadores2(fechaIni,fechaFin).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.data){
          //this.statData = statData2
         //this.statData = this.setStateVirus(res.data[0].virus)
        }
      }, error:(err)=>{
        console.log(err);
        
      }
    })
  }

  setStateVirus(data){
    let stateArr: State[]= []
    if(data.total != 0){
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          console.log(element);
          let porcentaje = (data[key].positivo*100)/(data[key].positivo + data[key].negativo)
          let elem : State= {
            title: key,
            value :data[key].positivo,
            persantage: porcentaje+'',
            profit:'up',
            icon:'bx bxs-virus'
          }
          stateArr.push(elem)
        }
      }
    }else{

      for (let i = 0; i < virus.length; i++) {
        const nombre = virus[i];
        let elem : State= {
          title: nombre,
          value :0,
          persantage:0+'',
          profit:'equal',
          icon:'bx bxs-virus'
        }
        stateArr.push(elem)
      }
      // this.cargando = false
    } 
   

    console.log(stateArr);
    return stateArr;
    
  }

  distribuirData(data){
    let allData = {
      serie:[],
      labels:[]
    }
    let serie = []
    this.total = data.total
    this.totalPositivos = data.totalPositivos
    this.totalNegativos = data.totalNegativos
    delete data['total']
    delete data['totalPositivos']
    delete data['totalNegativos']
    for (const key in data) {
      let nom =''
      nom  = key
      let labels = []
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        let nombre = key.split('^')
        let objectSerie = {
          name: nombre[1],
          data:[]
        }
        for (const key2 in element) {
          
          if (Object.prototype.hasOwnProperty.call(element, key2)) {
            const result = element[key2];
            if(result.positivo != undefined ){
              objectSerie.data.push(result.positivo)
              this.valorMax = (result.positivo > this.valorMax)? result.positivo:this.valorMax
            }else{
              objectSerie.data.push(0)
            }
            let label = 'semana '+ key2.replace('_','')
            labels.push(label)
          }
          
          console.log(this.categorias);
        }
        
        serie.push(objectSerie)
        this.categorias = labels
      }

    }
    this.cargando = false
    console.log(this.categorias);
    
    console.log(serie);
    return serie
  }
  // Chart Colors Set
  private getChartColorsArray(colors:any) {
    colors = JSON.parse(colors);
    return colors.map(function (value:any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color) {
            color = color.replace(" ", "");
            return color;
            }
            else return newValue;;
        } else {
            var val = value.split(',');
            if (val.length == 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
  }

  /**
 * Sales Analytics Chart
 */
  private _analyticsChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.analyticsChart = {
      chart: {
          height: 370,
          type: "line",
          toolbar: {
              show: false,
          },
      },
      stroke: {
          curve: "straight",
          dashArray: [0, 0, 8],
          width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
          name: 'Orders',
          type: 'area',
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
          name: 'Earnings',
          type: 'bar',
          data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
              88.51, 36.57]
      }, {
          name: 'Refunds',
          type: 'line',
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
      }],
      fill: {
          opacity: [0.1, 0.9, 1],
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
      markers: {
          size: [0, 0, 0],
          strokeWidth: 2,
          hover: {
              size: 4,
          },
      },
      xaxis: {
          categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
          ],
          axisTicks: {
              show: false,
          },
          axisBorder: {
              show: false,
          },
      },
      grid: {
          show: true,
          xaxis: {
              lines: {
                  show: true,
              },
          },
          yaxis: {
              lines: {
                  show: false,
              },
          },
          padding: {
              top: 0,
              right: -2,
              bottom: 15,
              left: 10,
          },
      },
      legend: {
          show: true,
          horizontalAlign: "center",
          offsetX: 0,
          offsetY: -5,
          markers: {
              width: 9,
              height: 9,
              radius: 6,
          },
          itemMargin: {
              horizontal: 10,
              vertical: 0,
          },
      },
      plotOptions: {
          bar: {
              columnWidth: "30%",
              barHeight: "70%",
          },
      },
    };
  }

   /**
   * Fetches the data
   */
    private fetchData() {
      this.BestSelling = BestSelling;
      this.TopSelling = TopSelling;
      this.RecentSelling = RecentSelling;
      this.statData = statData;
    }

  /**
   * Recent Activity
   */
   toggleActivity() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if(recentActivity != null){
      recentActivity.classList.toggle('d-none');
    }

    if (document.documentElement.clientWidth <= 767) {
      const recentActivity = document.querySelector('.layout-rightside-col');
      if(recentActivity != null){
        recentActivity.classList.add('d-block');
        recentActivity.classList.remove('d-none');
      }
    }
  }

  private _splineAreaChart(colors:any, series) {
    colors = this.getChartColorsArray(colors);
    this.splineAreaChart = {
      series: series,
      // [{
      //     name: 'Revenue',
      //     data: [20, 25, 30, 35, 40, 55, 70, 110, 150, 180, 210, 250]
      // },{
      //     name: 'Expenses',
      //     data: [12, 17, 45, 42, 24, 35, 42, 75, 102, 108, 156, 199]
      // }],
      chart: {
          height: 390,
          type: 'area',
          toolbar: 'false',
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'smooth',
          width: 2,
      },
      xaxis: {
          categories: this.categorias
      },
      yaxis: {
          tickAmount:15,
          min: 0,
          max: this.valorMax
      },
      colors: colors,
      fill: {
          opacity: 0.06,
          type: 'solid'
      }
    };
  }

}
