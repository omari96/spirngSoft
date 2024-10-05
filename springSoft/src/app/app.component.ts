import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { UserStore } from './store/user.store';
import { getState } from '@ngrx/signals';
import { UsersState } from './core/models/general-types';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatSidenavModule,SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  store = inject(UserStore);
  snackBar = inject(MatSnackBar)

  constructor() {
    effect(() => {
      const state: UsersState = getState(this.store);
      if (state.error) {
        this.snackBar.open(state.error, 'ok', {
          duration: 2000,
        });
      } else if(state.successMessage) {
        this.snackBar.open(state.successMessage, 'ok', {
          duration: 2000,
        });
      }
    })
  }
}
