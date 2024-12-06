import { Component, inject, ViewChild } from '@angular/core';
import { IUser } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { UserService } from '../../services/user.service';
import { UpdatePasswordComponent } from '../../components/update-password/update-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileFormComponent,
    UpdatePasswordComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent
  ],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  
  public user!: IUser;

  public profileService = inject(ProfileService);

  @ViewChild('updateModal') updateModal!: ModalComponent;
  @ViewChild('updatePasswordModal') updatePasswordModal!: ModalComponent;
  @ViewChild('deleteAccountModal') deleteAccountModal!: ModalComponent;

  constructor(){
    this.profileService.getUserProfileInfo();
  }

  handleFormAction(user: IUser) {
    this.profileService.update(user)
    this.updateModal.hide();
  }

  handlePasswordUpdateAction(user: IUser) {
    this.profileService.updatePassword(user).add(() => {
      this.updatePasswordModal.hide(); // Cerrar el modal
    });
  }

  deleteAccount() {
    const userId = this.profileService.user$().id;
    if (userId) {
      this.profileService.deleteAccount(userId).add(() => {
        this.deleteAccountModal.hide(); // Cerrar el modal
      });
    }
  }
}
