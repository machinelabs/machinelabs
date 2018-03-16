import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '../../login.service';
import { ExecutionRejectionReason } from '@machinelabs/models';

@Component({
  selector: 'ml-rejection-dialog',
  templateUrl: './rejection-dialog.component.html',
  styleUrls: ['./rejection-dialog.component.scss']
})
export class RejectionDialogComponent {
  ExecutionRejectionReason = ExecutionRejectionReason;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public loginService: LoginService) {}

  loginWithGithub() {
    this.loginService.loginWithGitHub();
  }
}
