import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChartComponent } from '../../components/chart/chart.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideEcharts } from 'ngx-echarts';
import { IMovie, IUser, IUserCountStats } from '../../interfaces';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,ChartComponent],
  providers: [provideEcharts()], 
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit{
  public usersStatsList: IUserCountStats[] = [];
  public usersList: IUser[] = [];
  public movieList: IMovie[] = [];
  public userService = inject(UserService);
  public movieService = inject(MovieService);
  
  ngOnInit(): void {
    this.userService.getUserMonth();
    this.userService.getAllSignal();
    this.movieService.getAll();
  }

}
