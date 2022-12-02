import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  validarRut(rut: string){
	console.log(rut);
	rut = rut.toString().trim()
	if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rut ))
			return false;
		var tmp 	= rut.split('-');
		var digv	= tmp[1]; 
		var rut 	= tmp[0];
		if ( digv == 'K' ) digv = 'k' ;
		return (this.dv(rut) == digv );

	//  var valor = rut.toString().replace('\.\g','').replace('-','');
	//  var cuerpo = valor.slice(0,-1);
	//  let dv = valor.slice(-1).toUpperCase();
	//  rut = cuerpo + '-'+ dv
	 
	//  if(cuerpo.length < 7) { return false; }
	 
	//  let suma = 0;
	//  let multiplo = 2;
	 
	//  for(let i=1;i<=cuerpo.length;i++) {
	// 	 let index = multiplo * valor.charAt(cuerpo.length - i);
	// 	 suma = suma + index;
	// 	 if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
	//  }
	 
	 
	//  let dvEsperado = 11 - (suma % 11);
	//  console.log(dvEsperado, dv);
	//  dv = (dv == 'K')?10:dv;
	//  dv = (dv == 0)?11:dv;
	 
	 
	//  return (dvEsperado == dv)? true:false;
	}
	dv (T : any){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}
}
