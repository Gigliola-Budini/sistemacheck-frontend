import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

  getMondayOfCurrentWeek(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  getDayOfCurrentWeek(d, day) {
    d = new Date(d);
    var dayaux = d.getDay(),
    diff = d.getDate() - dayaux + (dayaux == 0 ? -day:0); // adjust when day is sunday
    console.log( d.getDate(), dayaux,day);
    
    return new Date(d.setDate(diff));
  }

  formatFechaEsp(date:Date){
    let dd = (date.getDate() < 10) ? '0'+date.getDate(): date.getDate();
    let mm:any = date.getMonth()+1;   
    let yy = date.getFullYear();
    let hh= (date.getHours() < 10) ? '0'+date.getHours(): date.getHours();
    let mn = (date.getMinutes() < 10) ? '0'+date.getMinutes(): date.getMinutes();
    let ss= date.getSeconds();

    if(mm < 10 ){ mm = '0'+ mm}

    return dd+'/'+mm+'/'+yy;
  }
  
  sumarDias(fecha, dias){
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    }
}
