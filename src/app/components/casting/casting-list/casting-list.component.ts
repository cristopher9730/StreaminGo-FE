import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICasting, ICastingActor } from '../../../interfaces';
import { CastingService } from '../../../services/casting.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { CastingFormComponent } from '../casting-form/casting-form.component';
import { ActorService } from '../../../services/actor.service';
import { ConfirmDialogComponent } from '../../confirm/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-casting-list',
  standalone: true,
  imports: [    
    CommonModule,
    ModalComponent,
    CastingFormComponent],
  templateUrl: './casting-list.component.html',
  styleUrl: './casting-list.component.scss'
})
export class CastingListComponent implements OnChanges, OnInit{
  @Input() itemList: ICasting[] = [];
  @Input() areActionsAvailable: boolean = false;
  private dialog = inject(MatDialog);
  public selectedItem: ICasting = {};
  public castingService: CastingService = inject(CastingService);
  public actorService: ActorService = inject(ActorService);

  ngOnInit(): void {
    this.actorService.getAll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
  }
  
  showDetailModal(item: ICasting, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  handleFormAction(item: ICastingActor) {

    this.castingService.update(item.casting);
  }

  deleteCasting(item: ICasting) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.castingService.delete(item);
    }
    });
  }

}
