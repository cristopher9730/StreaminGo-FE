import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { UsersComponent } from '../users/users.component';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';
import { InviteModalComponent } from '../../components/invite-modal/invite-modal.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { GifService } from '../../services/gif.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Message } from '../../interfaces';

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [CommonModule, FormsModule, UsersComponent, NgClass, InviteModalComponent, ModalComponent, PickerModule],
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('exitModal') exitModal!: ModalComponent;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isHidden = false;
  isExpanded = false;
  isInvite = false;

  sessionCode: string = '';

  usuarioLogeado: any;
  nuevoMensaje: string = '';
  mensajes: any = [];

  nuevoMensajeRecibido = false;
  mensajesNuevos = 0

  videoSrc: string = '';
  videoId: string = '';
  player: any | undefined;
  isPaused = true;
  messages: Message[] = [];
  newMessage: string = '';
  /**Reacciones */
  showReactionPicker: boolean = false;
  customReactions = [
    { name: 'Sparkling Heart', icon: '💖' },
    { name: 'Thumbs Up', icon: '👍' },
    { name: 'Tada', icon: '🎉' },
    { name: 'Clapping', icon: '👏' },
    { name: 'Laughing', icon: '😂' },
    { name: 'Surprised', icon: '😲' },
    { name: 'Crying', icon: '😢' },
    { name: 'Thinking Face', icon: '🤔' },
    { name: 'Thumbs Down', icon: '👎' }
  ];
  // Floating emojis logic
  floatingEmojis: { icon: string, left: string, top: string }[] = [];
  animationDuration = 2000; // Duration of the animation in milliseconds
  /** Emoji variables */
  isEmojiPickerVisible: boolean = false;
  /** GIF variables */
  public gifQuery: string = '';
  public gifs: any[] = [];
  public showGifPicker: boolean = false;

  private socket$: WebSocketSubject<any> | undefined;

  constructor(private route: ActivatedRoute, private authService: AuthService, private gifService: GifService) {}

  ngOnInit(): void {
    this.connect();
    this.authService.getUserLogged().subscribe(usuario => {
      this.usuarioLogeado = usuario;
    });

    this.route.paramMap.subscribe(params => {
      const videoId = params.get('video');
      if (videoId) {
        this.videoId = videoId;
        this.videoSrc = `http://localhost:8080/stream/video?title=${videoId}`;
        this.initializePlayer();
      }
    });
    
    const sessionCodeUrl = this.route.snapshot.paramMap.get('sessionCode');
      if(sessionCodeUrl){
        this.isInvite = true;
        this.sessionCode = sessionCodeUrl;
      }else{
        this.sessionCode = this.generateRandomCode(16);
      }

  }

  ngAfterViewInit(): void {
    // Subscribe to play and pause events
    this.videoElement.nativeElement.addEventListener('play', this.onPlay.bind(this));
    this.videoElement.nativeElement.addEventListener('pause', this.onPause.bind(this));
  }

  private onPlay(event: Event): void {
    const currentTime = this.videoElement.nativeElement.currentTime;
    const mensaje = {
      status: "PLAY",
      time: currentTime,
      sessionCode: this.sessionCode
    };
    this.sendSocketMessage('videoControl',JSON.stringify(mensaje))
  }

  private onPause(event: Event): void {
    const currentTime = this.videoElement.nativeElement.currentTime;
    const mensaje = {
      status: "PAUSE",
      time: currentTime,
      sessionCode: this.sessionCode
    };
    this.sendSocketMessage('videoControl',JSON.stringify(mensaje))
  }

  public syncVideoTime(time: number): void {
    if (this.player) {
      this.player.currentTime(time); // Ajusta el tiempo del video al especificado
      console.log(`Video sincronizado al tiempo: ${time} segundos`);
    }
  }

  private connect() {
    this.socket$ = new WebSocketSubject('ws://localhost:8080/ws');
  
    this.socket$.subscribe(
      message => this.handleMessage(message),
      err => {
        console.error('WebSocket Error:', err);
        this.reconnect(); // Intentar reconectar en caso de error
      },
      () => {
        console.warn('WebSocket Completed!');
        this.reconnect();
      }
    );
  }

  private reconnect() {
    // Destruir la instancia actual y crear una nueva
    this.socket$?.complete();
    setTimeout(() => this.connect(), 100); 
  }

  private handleMessage(message: any) {
    let parsedMessage: any;

    if (typeof message === 'string') {
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        console.error('Error al parsear el mensaje:', error);
        return;
      }
    } else {
      parsedMessage = message;
    }

    console.log('Mensaje recibido:', parsedMessage);

    if (parsedMessage.type === 'videoControl') {
      this.handleStatusChange(parsedMessage.status);
    } else if (parsedMessage.type === 'chat') {
      this.handleChatMessage(parsedMessage.status);
    } else if (parsedMessage.type === 'reaction') {
      this.handleReaction(parsedMessage.status);
    } else {
      console.error('Tipo de mensaje no reconocido:', parsedMessage);
    }
  }

  private handleStatusChange(message: string) {
    try {
      const parsedMessage = JSON.parse(message);
      if(parsedMessage.sessionCode != this.sessionCode){
        return;
      }
      if (parsedMessage.status === 'EXIT'){
        if(this.isInvite){
          this.exitModal.show()
          setTimeout(() => {
            this.volverDashboard()
          }, 5000);
        }else{
          this.volverDashboard()
        }
        
      }
      this.syncVideoTime(parsedMessage.time);
      if (parsedMessage.status === 'PLAY') {
        this.player.play().catch((error: any) => {
          console.error('Error trying to play the video:', error);
          this.reconnect(); 
        });
      } else if (parsedMessage.status === 'PAUSE') {
        this.player.pause();
      }
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
    }
  }

  volverDashboard(){
    this.exitModal.hide()
    window.location.href='app/dashboard'
  }

  private handleChatMessage(message: string) {
    const parsedMessage = JSON.parse(message);
    if(parsedMessage.sessionCode != this.sessionCode){
      return;
    }
    if (parsedMessage.emisor !== this.usuarioLogeado.name) {

      // Check if the message is a GIF 
      const isGif = parsedMessage.texto.includes('giphy');

      // Push the message to the messages array
      this.messages.push({
        sender: parsedMessage.emisor,
        text: isGif ? '' : parsedMessage.texto,
        isGif: isGif,
        gifUrl: isGif ? parsedMessage.texto : '',
        timestamp: new Date()
      });

      this.scrollToBottom();

      this.mensajesNuevos++;
      this.nuevoMensajeRecibido = true;
    }
  }

  private handleReaction(reaction: string) {
    const parsedMessage = JSON.parse(reaction);
    if(parsedMessage.sessionCode != this.sessionCode){
      return;
    }
    if (parsedMessage.emisor !== this.usuarioLogeado.name) {
      this.triggerFloatingEmoji(parsedMessage.emoji);
    }
  }

  public sendSocketMessage(typeMessage: string, command: string) {
    if (this.socket$) {
      const message = { type: typeMessage, status: command };
      this.socket$.next(message);
    }
  }

  cerrarSala(){
    if(this.isInvite){
      this.volverDashboard();
    }else{
      const currentTime = this.videoElement.nativeElement.currentTime;
      const mensaje = {
        status: "EXIT",
        time: currentTime,
        sessionCode: this.sessionCode
      };
      this.sendSocketMessage('videoControl',JSON.stringify(mensaje))
    }
    
  }

  reiniciarContador() {
    this.mensajesNuevos = 0;
    this.nuevoMensajeRecibido = false;
  }

  enviarMensaje() {
    if (this.nuevoMensaje === '') return;

    const mensaje = {
      emisor: this.usuarioLogeado.name,
      texto: this.nuevoMensaje,
      sessionCode: this.sessionCode
    };

    this.sendSocketMessage('chat', JSON.stringify(mensaje))

    this.mensajes.push({
      emisor: this.usuarioLogeado.name,
      texto: this.nuevoMensaje
    });
  }

  sendMessage(): void {
    const messageText = this.newMessage.trim();

    this.mensajesNuevos = 0;
    this.nuevoMensajeRecibido = false;

    if (messageText) {
      // Check if the message is a GIF 
      const isGif = messageText.includes('giphy');

      // Push the message to the messages array
      this.messages.push({
        sender: 'me',
        text: isGif ? '' : messageText, 
        isGif: isGif,                 
        gifUrl: isGif ? messageText : '',
        timestamp: new Date() 
      });

      const mensaje = {
        emisor: this.usuarioLogeado.name,
        texto: messageText,
        sessionCode: this.sessionCode
      };

      this.sendSocketMessage('chat', JSON.stringify(mensaje))
      
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  addReaction(reaction: string): void {
    const mensaje = {
      emisor: this.usuarioLogeado.name,
      emoji: reaction,
      sessionCode: this.sessionCode
    };

    this.sendSocketMessage('reaction', JSON.stringify(mensaje))
    this.triggerFloatingEmoji(reaction);
  }

  triggerFloatingEmoji(icon: string) {
    // Calculate random position for the emoji
    const left = `${Math.random() * 80 + 10}%`; // Random horizontal position (10% to 90%)
    const top = `${Math.random() * 70 + 10}%`;  // Random vertical position (10% to 80%)

    const floatingEmoji = {
      icon: icon,
      left: left,
      top: top
    };

    this.floatingEmojis.push(floatingEmoji);

    // Remove the emoji after animation
    setTimeout(() => {
      this.floatingEmojis.shift();
    }, this.animationDuration);
  }
  /** EMOJIS LOGIC */

  onEmojiSelected(event: any): void {

    const emoji = event.emoji.native;
    this.newMessage += emoji; 
    this.toggleEmojiPicker(); 
  }

  toggleEmojiPicker(): void {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  /** EMOJIS LOGIC */

  /** START GIF LOGIC */
  toggleGifPicker() {
    this.showGifPicker = !this.showGifPicker; 
  }

  searchGifs(query: string) {
    this.gifService.searchGifs(query).then((response: any) => {
      this.gifs = response.data;
    }).catch((error: any) => {
      console.error('Error fetching GIFs:', error);
    });
  }

  selectGif(gif: any) {

    this.newMessage = gif.images.fixed_height.url;
    this.showGifPicker = false;
  }
  /** END GIF LOGIC */

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 100);
  }

  initializePlayer(): void {

    this.player = videojs('video', {
      sources: [{
        src: this.videoSrc,
        type: 'video/mp4'
      }],
      tracks: []
    }, () => {
      this.loadSubtitles('en');
      this.loadSubtitles('es');
    });

    // Add event listeners to the player
    this.player.on('play', () => {
      this.isPaused = false;

    });

    this.player.on('pause', () => {
      this.isPaused = true;

    });

  }

  loadSubtitles(lang: string): void {
    const body = { title: this.videoId, lang: lang };
    fetch('http://localhost:8080/stream/subtitles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.text())
    .then(subtitleText => {
      const blob = new Blob([subtitleText], { type: 'text/vtt' });
      const url = URL.createObjectURL(blob);

      const tracks = this.player.remoteTextTracks();
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.kind === 'subtitles' && track.language === lang) {
          this.player.removeRemoteTextTrack(track);
        }
      }

      this.player.addRemoteTextTrack({
        kind: 'subtitles',
        src: url,
        srclang: lang,
        label: lang === 'en' ? 'English' : 'Español',
        default: lang === 'en'
      }, true);
    });
  }

  generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
