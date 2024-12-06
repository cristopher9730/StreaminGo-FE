import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IActor, ICasting, ICastingActor } from '../../../interfaces';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-casting-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './casting-form.component.html',
  styleUrls: ['./casting-form.component.scss']
})
export class CastingFormComponent implements OnInit, OnChanges {
  @Input() casting: ICasting = {};
  @Input() actorList: IActor[] = [];
  @Input() action = '';
  @Output() callParentEvent: EventEmitter<ICastingActor> = new EventEmitter<ICastingActor>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>()

  public castingForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.castingForm = this.fb.group({
      name: [this.casting.name || '', Validators.required],
      selectedActors: [[], Validators.required]  // Se espera un array de IDs
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['casting']) {
      this.updateForm();
    }
  }

  updateForm() {
    if (this.castingForm) {
      this.castingForm.patchValue({
        name: this.casting.name || '',
        selectedActors: this.casting.actor ? this.casting.actor.map(actor => actor.id) : []
      });
    }
  }

  callEvent() {
    if (this.castingForm.invalid) {
      this.castingForm.markAllAsTouched();
      return;
    }

    // Obtener la lista de IDs seleccionados
    const selectedActorIds = this.castingForm.get('selectedActors')?.value;

    // Mapear IDs a objetos de actores completos
    const selectedActors = this.actorList.filter(actor => selectedActorIds.includes(actor.id));

    const eventPayload: ICastingActor = {
      casting: {
        ...this.casting,
        name: this.castingForm.get('name')?.value,
        actor: selectedActors // Incluir lista completa de actores
      },
      selectedActors: selectedActorIds // Enviar IDs si el backend los necesita
    };
    
    // Emitir el evento con el payload adecuado
    this.callParentEvent.emit(eventPayload);

    this.closeModal.emit();

    this.resetForm();
  }
  resetForm() {
    this.castingForm.reset({
      name: '',
      selectedActors: []
    });
  }
}
