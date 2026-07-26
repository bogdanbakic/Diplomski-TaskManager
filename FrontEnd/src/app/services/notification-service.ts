import { inject, Injectable } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly snackBar = inject(MatSnackBar);
  private readonly config = inject<MatSnackBarConfig>(MAT_SNACK_BAR_DEFAULT_OPTIONS, { optional: true }) ?? {};

  default(message: string) {
    this.show(message, {
      ...this.config,
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: 'default-notification'
    });
  }

  success(message: string) {
    this.show(message, {
      ...this.config,
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: 'success-notification'
    });
  }

  error(message: string) {
    this.show(message, {
      ...this.config,
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: 'error-notification'
    });
  }

  show(message: string, configuration: MatSnackBarConfig, action: string = 'Close') {
    return this.snackBar.open(message, action, configuration);
  }

}
