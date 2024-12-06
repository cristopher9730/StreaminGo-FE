import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '../node_modules/swiper/swiper-bundle.min.css';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
