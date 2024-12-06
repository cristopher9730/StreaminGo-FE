import { Component, inject, OnInit } from '@angular/core';
import { ActorService } from '../../services/actor.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IActor } from '../../interfaces';
import { ActorListComponent } from "../../components/actor/actor-list/actor-list.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ActorFormComponent } from "../../components/actor/actor-form/actor-form.component";
import { ModalComponent } from "../../components/modal/modal.component";

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [ActorListComponent, LoaderComponent, ActorFormComponent, ModalComponent],
  templateUrl: './actors.component.html',
  styleUrl: './actors.component.scss'
})
export class ActorsComponent implements OnInit {

  public actorService: ActorService = inject(ActorService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService =  inject(AuthService);
  public routeAuthorities: string[] =  [];

  ngOnInit(): void {
    this.actorService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  handleFormAction(item: IActor) {
    this.actorService.save(item);
  }

}
