import { User } from "./user";

export type UsersState = {
    users: User[];
    currentUser: Partial<User>;
    userQuantity: number | null,
    pagination: PaginationParams;
    loading: boolean;
    successMessage: string;
    error: string | undefined;
}

export interface PaginationParams {
    pageIndex: number;
    pageSize: number;
}
