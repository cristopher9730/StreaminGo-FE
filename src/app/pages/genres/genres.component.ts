import { Component, inject, OnInit } from '@angular/core';
import { GenreListComponent } from '../../components/genre/genre-list/genre-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { IGenre } from '../../interfaces';
import { GenreService } from '../../services/genre.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { GenreFormComponent } from "../../components/genre/genre-form/genre-form.component";

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [
    GenreListComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent,
    GenreFormComponent
],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss'
})
export class GenresComponent implements OnInit{

  public genreService: GenreService = inject(GenreService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService =  inject(AuthService);
  public routeAuthorities: string[] =  [];

  ngOnInit(): void {
    this.genreService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  handleFormAction(item: IGenre) {
    this.genreService.save(item);
  }

}
