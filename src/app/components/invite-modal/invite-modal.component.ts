import { Component, Inject, Input, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './invite-modal.component.html',
  styleUrl: './invite-modal.component.scss'
})
export class InviteModalComponent implements OnInit{
  currentUrl: string = "";
  @Input() sessionCode = "";
  constructor(private snackBar: MatSnackBar){

  }

  ngOnInit(): void {
    this.currentUrl = this.sessionCode != "" ? window.location.href + '/' + this.sessionCode : window.location.href;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.currentUrl).then(() => {
      this.snackBar.open('Url copied to clipboard!', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['Succes-snackbar']})
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}
