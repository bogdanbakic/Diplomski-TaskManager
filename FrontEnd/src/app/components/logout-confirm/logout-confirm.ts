import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout-confirm',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './logout-confirm.html',
  styleUrl: './logout-confirm.scss',
})
export class LogoutConfirm {
  constructor(private dialogRef: MatDialogRef<LogoutConfirm>) { }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}