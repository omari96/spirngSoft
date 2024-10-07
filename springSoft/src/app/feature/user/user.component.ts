import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserStore } from '../../store/user.store';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { defaultImageUrl } from '../../core/const/default-links';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../core/models/user';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FORM_SAVE_KEY } from '../../core/const/general-types';
import { UsersState } from '../../core/models/general-types';
import { getState } from '@ngrx/signals';

@Component({
  selector: 'user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButton,
    MatIconModule,
    MatInputModule,
  ],
  providers: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  store = inject(UserStore);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroy$: Subject<void> = new Subject();
  userForm!: FormGroup;
  defaultImgUrl = defaultImageUrl;
  showFooterButtons: boolean = true;
  cancelButtonShow: boolean = true;

  constructor(private fb: FormBuilder) {
    effect(() => {
      const state: UsersState = getState(this.store);
      if (Object.keys(state.currentUser).length) {
        this.patchUserData(state.currentUser);
      }
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.retrieveRouteParams();
  }

  onSubmit(value: Partial<User>) {
    if (Object.keys(this.store.currentUser()).length) {
      this.store.updateUser(value);
      this.cancelModification();
    } else {
      this.store.addUser(value);
      this.userForm.reset();
    }
    localStorage.removeItem(FORM_SAVE_KEY);
  }

  retrieveRouteParams() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((p) => p['id'])
      )
      .subscribe((userId) => {
        userId ? this.store.getUser(userId) : this.userAddingMode();
      });
  }

  userAddingMode() {
    this.store.removeCurrentUser();
    this.userForm.reset();
    this.userForm.enable();
    this.showFooterButtons = true;
    this.cancelButtonShow = false
    if (typeof window !== 'undefined' && localStorage) {
      const currentFormValues = localStorage.getItem(FORM_SAVE_KEY);
      if (currentFormValues) {
        this.userForm.patchValue(JSON.parse(currentFormValues));
      }
    }
    this.preserveFormValues();
  }

  preserveFormValues(): void {
    this.userForm.valueChanges.subscribe(() => {
      const values = this.userForm.getRawValue();
      localStorage.setItem(FORM_SAVE_KEY, JSON.stringify(values));
    });
  }

  buildForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      img: [null],
    });
  }

  patchUserData(currentUser: Partial<User>) {
    Object.entries(currentUser).forEach(([key, value]) =>
      this.userForm.get(key)?.patchValue(value)
    );
    this.userForm.disable();
    this.showFooterButtons = false;
  }

  cancelModification() {
    this.showFooterButtons = false;
    this.userForm.disable();
  }

  modifyUser() {
    this.userForm.enable();
    this.showFooterButtons = true;
  }

  ngOnDestroy() {
    this.store.removeCurrentUser();
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
