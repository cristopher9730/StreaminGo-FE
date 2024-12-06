import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { IMovie, IUser, IUserCountStats } from '../../interfaces';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule
  ], 
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges{
  @Input() usersStatsList: IUserCountStats[] = [];
  @Input() usersList: IUser[] = [];
  @Input() movieList: IMovie[] = [];

  public userList: IUser[] = [];

  chartOptions: any;
  userCounter : any;
  movieCounter : any;
  pieChartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usersStatsList']) {
      this.formatData(this.usersStatsList);
    }
    if (changes['usersList']) {
      this.userCounter = this.usersList.length;
    }
    if (changes['movieList']) {
      this.movieCounter = this.movieList.length;
      this.pieChart();
    }


  }

  // ECharts options
  formatData(data: any[]): void {
    const months = data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`);
    const counts = data.map(item => item.count);

    this.chartOptions = {
      title: {
        text: 'Registered users by date',
        textStyle: {
          color: '#21201E', 
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{a}: {c}'
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'User Count',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: (params : any) => {
            const colors = ['#962DFF', '#F0E5FC']; 
            return colors[params.dataIndex % colors.length];
          }
        }
      }]
    };
  }

  pieChart():void{
    this.pieChartOptions = {
      title: {
        text: 'Movie Genres Distribution',
        textStyle: {
          color: '#21201E', 
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: 10,
        left: 'center',
        textStyle: {
          color: '#21201E'
        }
      },
      series: [
        {
          name: 'Genres',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 335, name: 'Action' },
            { value: 310, name: 'Drama' },
            { value: 234, name: 'Comedy' },
            { value: 135, name: 'Thriller' },
            { value: 1548, name: 'Romance' }
          ],
          itemStyle: {
            color: (params: any) => {
              const colors = ['#962DFF', '#E0C6FD', '#93AAFD', '#4A3AFF'];
              return colors[params.dataIndex % colors.length];
            }
          },
          label: {
            color: '#21201E' 
          },
          labelLine: {
            lineStyle: {
              color: '#21201E' 
            }
          },
          emphasis: {
            itemStyle: {
              borderColor: '#000',
              borderWidth: 1
            },
            label: {
              color: '#21201E' 
            }
          }
        }
      ]
    };
  }

}

