import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIcon} from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppUrlEnum } from '../../core/const/route.enums';
import { UserStore } from '../../store/user.store';
import { defaultImageUrl } from '../../core/const/default-links';


@Component({
  standalone: true,
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [  CommonModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon]
})
export class UserListComponent implements OnInit {
  store = inject(UserStore); 
  router = inject(Router);
  displayedColumns: string[] = ['img', 'firstName', 'lastName', 'email', 'phone', 'delete'];
  resultsLength = 20;

  AppUrlEnum = AppUrlEnum;
  defaultImgUrl = defaultImageUrl;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.store.loadUsers();
    this.resultsLength = this.store.users().length;
  }

 

  onRemoveUser(id: string, event: Event) {
    event.stopImmediatePropagation();
    this.store.removeUser(id);
  }

  openUser(userId: string) {
    this.router.navigate([`${AppUrlEnum.USER}/${userId}`])
  }

  handlePageEvent(event: PageEvent) {
    this.store.pagination().pageIndex = event.pageIndex;
    this.store.pagination().pageSize = event.pageSize;
    this.loadUsers();
    this.savePaginationParameters();
  }

  savePaginationParameters() {
    localStorage.setItem('pagination', JSON.stringify({
      pageSize: this.store.pagination().pageSize,
      pageIndex: this.store.pagination().pageIndex
    }));
  }

}
