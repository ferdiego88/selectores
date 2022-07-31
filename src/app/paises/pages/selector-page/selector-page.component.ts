import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/pais.interface';

import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['',Validators.required],
    pais: ['',Validators.required],
    frontera: ['',Validators.required]
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando:boolean = false;
  constructor(private fb: FormBuilder,
              private paisesService:PaisesService) { }

  ngOnInit(): void {
   this.regiones = this.paisesService.regiones;


   //Cuando cambia la region
  this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) => {
        //Resetear el valor del selector pais
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region) )
    )
    .subscribe(paises => {
       this.paises = paises;
       this.cargando = false;
    })


//Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          //Resetear el valor del selector pais
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisesPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisPorAlphaCode(pais?.borders!)),
      )
      .subscribe(paises => {
       //this.fronteras = pais?.borders || [];
       this.fronteras = paises;
       this.cargando = false;
       console.log(paises);

     })

  }

  guardar() {
   console.log(this.miFormulario.value);
  }

}
