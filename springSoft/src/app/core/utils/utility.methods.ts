import { inject } from "@angular/core";
import { PaginationParams } from "../models/general-types";
import { UserStore } from "../../store/user.store";
import { patchState } from "@ngrx/signals";
import { tap, timer } from "rxjs";
import { ApiEnum } from "../const/api.enums";
import { url } from "../const/base-url";


export class Utils {
    store = inject(UserStore);

    static trimErrorString = (error: string) => {
        const index = error.lastIndexOf(':');
        return error.slice(index);
    }

    static constructUrlWithParams = (
        pagination?: PaginationParams, 
    ): string => {
        let urls= `${url.baseUrl_api}/${ApiEnum.USERS}`;
        const params: string[] = [];

        if (pagination && Object.keys(pagination).length) {
            params.push(`_page=${pagination.pageIndex + 1}`);
            params.push(`_limit=${pagination.pageSize}`);
        }
      
        if (params.length > 0) urls += `?${params.join('&')}`;

        return urls;
    }

    static setAndClearSuccessMessage(message: string, store: any) {
        return tap(() => {
          patchState(store, { successMessage: message });
          timer(2000).subscribe(() => {
            patchState(store, { successMessage: '' });
          });
        });
      }
}