import { Component, inject, OnInit } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CastingFormComponent } from '../../components/casting/casting-form/casting-form.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ActorService } from '../../services/actor.service';
import { CastingService } from '../../services/casting.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ICasting, ICastingActor } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { CastingListComponent } from '../../components/casting/casting-list/casting-list.component';

@Component({
  selector: 'app-casting',
  standalone: true,
  imports: [LoaderComponent, CommonModule, CastingFormComponent, ModalComponent, CastingListComponent],
  templateUrl: './casting.component.html',
  styleUrl: './casting.component.scss'
})
export class CastingComponent implements OnInit{

  public castingService: CastingService = inject(CastingService);
  public actorService: ActorService = inject(ActorService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService =  inject(AuthService);
  public routeAuthorities: string[] =  [];

  ngOnInit(): void {
    this.castingService.getAll();
    this.actorService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  handleFormAction(item: ICastingActor) {
    this.castingService.save(item.casting, item.selectedActors);
  }

}
