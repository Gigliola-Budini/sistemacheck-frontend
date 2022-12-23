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
}
