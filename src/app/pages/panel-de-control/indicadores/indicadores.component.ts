import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { tileLayer, latLng, circle } from 'leaflet';
import { ChartType } from './dashboard.model';
import { SwiperDirective, SwiperComponent } from 'ngx-swiper-wrapper';
import { SwiperOptions } from 'swiper';
import { BestSelling, TopSelling, RecentSelling, statData } from '../../dashboards/dashboard/data';
import { RestApiCheckService } from 'src/app/core/services/rest-api-check.service';

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
  semana: 42,
  positivos:24,
  negativos:40
}]
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

  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;

  constructor(private respApiService: RestApiCheckService) { }

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

    // Chart Color Data Get Function
    this._analyticsChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    this.obtenerDatosIndicadores('27/01/2022','01/01/2023')
    this.obtenerDatosIndicadoresEtereos('27/01/2022','01/01/2023')
   
  }

  obtenerDatosIndicadores(fechaIni,fechaFin){
    this.respApiService.getIndicadores(fechaIni,fechaFin).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.data){
          //this.statData = statData2
         this.statData = this.setStateVirus(res.data[0].virus)
        }
      }, error:(err)=>{
        console.log(err);
        
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
          icon:'bx-dollar-circle'
        }
        stateArr.push(elem)
      }
    }

    console.log(stateArr);
    return stateArr;
    
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
 *  Sales Category
 */
   private _SalesCategoryChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.SalesCategoryChart = {
      series: [44, 55, 41, 17, 15],
      labels: ["Direct", "Social", "Email", "Other", "Referrals"],
      chart: {
          height: 333,
          type: "donut",
      },
      legend: {
          position: "bottom",
      },
      stroke: {
          show: false
      },
      dataLabels: {
          dropShadow: {
              enabled: false,
          },
      },
      colors: colors
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
   * Sale Location Map
   */
  options = {
    layers: [
      tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: -1,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      })
    ],
    zoom: 1.1,
    center: latLng(28, 1.5)
  };
  layers = [
    circle([41.9, 12.45], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([12.05, -61.75], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([1.3, 103.8], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
  ];

  /**
 * Swiper Vertical  
   */
   public Vertical: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'vertical',
    slidesPerView: 2,
    pagination: true,
  };

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

  /**
   * SidebarHide modal
   * @param content modal content
   */
   SidebarHide() {
    const recentActivity = document.querySelector('.layout-rightside-col');
      if(recentActivity != null){
        recentActivity.classList.remove('d-block');
      }
  }

}
