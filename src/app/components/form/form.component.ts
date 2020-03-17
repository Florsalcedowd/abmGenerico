import { Component, OnInit, Host, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public formPersona: FormGroup;
  public personaOriginal: Persona;
  public edit = false;
  public isError = false;

  @Input() set personaEditar(valor) {
    this.onBuild();
    if (valor) {
      this.personaOriginal = valor;
      this.formPersona.setValue({
        id: valor.id,
        nombre: valor.nombre,
        apellido: valor.apellido,
        dni: valor.dni
      });
      this.edit = valor.id !== 0 ? true : false;
    }
  }

  @ViewChild('btnClose', {static: true}) btnClose: ElementRef;

  constructor(private personaService: PersonaService,
              @Host() private tabla: TableComponent,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.onBuild();
    this.edit = false;
  }

  onBuild() {
    this.formPersona = this.formBuilder.group({
      id: new FormControl(0),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      dni: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,8}')])
    });
  }

  onSave(formPersona: FormGroup): void {
    if (formPersona.invalid) {
      this.isError = true;
    } else {
      if (formPersona.value.id === 0) {
        // Agregar
        this.add(formPersona.value);
      } else {
        this.update(formPersona.value);
      }
      this.btnClose.nativeElement.click();
    }
  }

  add(persona: Persona) {
    this.personaService.post(persona).subscribe(
      res => {
        this.tabla.personas.push(res);
      },
      err => {
        alert('Ocurrió un error al agregar la persona');
      }
    );
  }

  update(persona: Persona) {
    this.personaService.put(persona.id, persona).subscribe(
      res => {
        alert('Persona fue actualizada con éxito');
        console.log(this.personaOriginal);
        this.tabla.personas.filter( item => {
          if (item.id === persona.id) {
            const idexOfPersona = this.tabla.personas.indexOf(item);
            this.tabla.personas[idexOfPersona] = res;
          }
        });
      },
      err => {
        alert('Ocurrió un error al actualizar persona');
      }
    );
  }

  onClose() {
    this.tabla.personaActual = {
      id: 0,
      nombre: '',
      apellido: '',
      dni: null
    };
    this.isError = false;
    this.edit = false;
  }

  onCloseAlert() {
    this.isError = false;
  }

}
