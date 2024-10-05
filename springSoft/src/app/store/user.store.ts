import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { map, pipe, switchMap, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../core/models/user';
import { UsersState } from '../core/models/general-types';
import { url } from '../core/const/base-url';
import { ApiEnum } from '../core/const/api.enums';
import { Utils } from '../core/utils/utility.methods';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';



const initialUsersState: UsersState = {
  users: [],
  currentUser: {},
  userQuantity: null,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  loading: false,
  successMessage: '',
  error: undefined,
};


export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialUsersState),

  withMethods((store, http = inject(HttpClient)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { loading: true });
          const url = Utils.constructUrlWithParams(
            store.pagination(),
          );
          return http.get<User[]>(url, { observe: 'response' });
        }),
        tap((response: HttpResponse<User[]>) => {
          console.log(store,'store')
          patchState(store, {
            users: response.body!,
            userQuantity: Number(response.headers.get('X-Total-Count')),
            loading: false,
          });
        })
      )
    ),

    getUser: rxMethod<string>(
      pipe(
        switchMap((userId: string) =>
          http.get<User>(
            `${url.baseUrl_api}/${ApiEnum.USERS}/${userId}`
          )
        ),
        tap((response: User) => {
          patchState(store, { currentUser: response });
        })
      )
    ),

  }))
);
