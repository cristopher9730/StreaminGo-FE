import { Injectable } from '@angular/core';
import giphy from 'giphy-api';

@Injectable({
  providedIn: 'root'
})
export class GifService {
  private giphyClient: any;

  constructor() {
    this.giphyClient = giphy('5oOK5rTPgaD4Dyl5UiHwJERDPE2DDOTl'); 
  }

  searchGifs(query: string, limit: number = 10) {
    return this.giphyClient.search({ q: query, limit });
  }
}