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

  /*  */
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

  /* Elemento que permite cerrar el modal de forma nativa */
  @ViewChild('btnClose', {static: true}) btnClose: ElementRef;

  constructor(private personaService: PersonaService,
              @Host() private tabla: TableComponent,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.onBuild();
  }

  /* Método que construye nuestro formulario */
  onBuild() {
    this.formPersona = this.formBuilder.group({
      id: new FormControl(0),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      dni: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,8}')])
    });
  }

  /* Al darle click a guardar en el formulario */
  onSave(formPersona: FormGroup): void {
    if (formPersona.invalid) {
      this.isError = true;
    } else {
      if (formPersona.value.id === 0) {
        // Agregar
        this.add(formPersona.value);
      } else {
        // Actualizar
        this.update(formPersona.value);
      }
      this.btnClose.nativeElement.click();
    }
  }

  /* Método que suscribe al método post del servicio y realiza la agregación de una persona */
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

  /* Método que suscribe al método put del servicio y realiza la actualización de una persona */
  update(persona: Persona) {
    this.personaService.put(persona.id, persona).subscribe(
      res => {
        alert('Persona fue actualizada con éxito');
        this.tabla.personas.filter( item => {
          if (item.id === persona.id) {
            const idexOfPersona = this.tabla.personas.indexOf(item);
            this.tabla.personas.splice(idexOfPersona, 1, res);
          }
        });
      },
      err => {
        alert('Ocurrió un error al actualizar persona');
      }
    );
  }

  /* Al cerrar ventana modal */
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

  /* Al cerrar alerta del formulario */
  onCloseAlert() {
    this.isError = false;
  }

}
