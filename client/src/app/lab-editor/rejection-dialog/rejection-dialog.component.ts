import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { ExecutionRejectionReason } from '../../models/execution';

@Component({
  selector: 'ml-rejection-dialog',
  templateUrl: './rejection-dialog.component.html',
  styleUrls: ['./rejection-dialog.component.scss']
})
export class RejectionDialogComponent {
  ExecutionRejectionReason = ExecutionRejectionReason
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {}
}
