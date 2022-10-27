export interface Muestra{
    apellidos: string
    edad: string;
    fechaMuestra: string
    muestras:  
    {
        examen: string;
        resultado: string;
        validez:string;
        value:string;
    }[];
    nombres: string;
    pid: number;
    rut:string;
    sexo: string;
}