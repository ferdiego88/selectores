import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl = 'https://restcountries.com/v2';
  private _regiones:string [] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones () {
    return this._regiones;
  }
  constructor(private http: HttpClient) { }

  getPaisesPorRegion(pais: String): Observable<PaisSmall[]>{

    const url: string = `${this._baseUrl}/region/${pais}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);

  }

  getPaisesPorCodigo(codigo: String): Observable<Pais | null>{
    if (!codigo) {
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;

    return this.http.get<Pais>(url);

  }

  getPaisName(codigo: String): Observable<PaisSmall> {
    // https://restcountries.com/v2/alpha/per?fields=name,alpha3Code
    const url = `${this._baseUrl}/alpha/${codigo}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);

  }

  getPaisPorAlphaCode(borders: string[]):Observable<PaisSmall[]> {

      if (!borders) {
        return of([])
      }

      const peticiones: Observable<PaisSmall>[] = [];

      borders.forEach(alphaCode=> {
        const peticion = this.getPaisName(alphaCode);
        peticiones.push(peticion);
      })
      return combineLatest(peticiones);
  }
}
