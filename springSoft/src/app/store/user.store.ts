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

    updateUser: rxMethod<Partial<User>>(
      pipe(
        switchMap((user: Partial<User>) =>
          http.patch<User>(
            `${url.baseUrl_api}/${ApiEnum.USERS}/${
              store.currentUser().id
            }`,
            user
          )
        ),
        tap((response: User) => {
          patchState(store, { currentUser: response as User });
        }),
        Utils.setAndClearSuccessMessage(`User  successfully Updated`, store)
      )
    ),

    addUser: rxMethod<Partial<User>>(
      pipe(
        switchMap((user: Partial<User>) =>
          http.post<User>(`${url.baseUrl_api}/${ApiEnum.USERS}`, user)
        ),
        Utils.setAndClearSuccessMessage(`User  successfully Added`, store)
      )
    ),

    removeCurrentUser: () => {
      patchState(store, { currentUser: {} as User, error: undefined });
    },

    removeUser: rxMethod<string>(
      pipe(
        switchMap((userId: string) =>
          http
            .delete<void>(
              `${url.baseUrl_api}/${ApiEnum.USERS}/${userId}`
            )
            .pipe(map((result) => ({ userId, result })))
        ),

        tap(({ userId }) => {
          const updatedUsers = store
            .users()
            .filter((user) => user.id !== userId);
          patchState(store, {
            users: updatedUsers,
            userQuantity: store.userQuantity() && store.userQuantity()! - 1,
          });
        }),
        Utils.setAndClearSuccessMessage('User successfully removed', store)
      )
    ),

  }))
);
