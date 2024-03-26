import { Component } from '@angular/core';
import { MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  constructor(private snackBar: MatSnackBar) {}

  showSignupSuccessMessage(): void {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';
    this.snackBar.open('Signup Successful!', 'Close', {
      duration: 3000, // 3 seconds
      horizontalPosition: 'center', // Horizontal position, e.g., 'start', 'center', 'end', 'left', 'right'
      verticalPosition: 'top', // Vertical position, e.g., 'top', 'bottom'
    });
  }

  showEditSuccessMessage(): void {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';
    this.snackBar.open('Profile Updated Successfully!', 'Close', {
      duration: 3000, // 3 seconds
      horizontalPosition: 'center', // Horizontal position, e.g., 'start', 'center', 'end', 'left', 'right'
      verticalPosition: 'top', // Vertical position, e.g., 'top', 'bottom'
    });
  }
}
