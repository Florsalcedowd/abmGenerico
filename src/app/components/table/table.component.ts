import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  public personas: Persona[];
  public personaActual: Persona = {
    id: 0,
    nombre: '',
    apellido: '',
    dni: null
  };
  constructor(private personaService: PersonaService) { }

  ngOnInit() {
    this.getAllPersonas();
  }

  getAllPersonas() {
    this.personaService.getAll().subscribe( res => {
      this.personas = res;
    });
  }

  delete(persona: Persona) {
    const opcion = confirm('¿Desea eliminar este registro?');
    if (opcion === true) {
      this.personaService.delete(persona.id).subscribe(
        res => {
          alert('El registro fue eliminado con éxito');
          const indexPersona = this.personas.indexOf(persona);
          this.personas.splice(indexPersona, 1);
        }
      );
    }
  }

  onPreUpdate(persona: Persona) {
    this.personaActual = persona;
  }

}
