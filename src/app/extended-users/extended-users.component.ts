import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { MaterialModule } from '../../modules/material.module';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-extended-users',
  standalone: true,
  imports: [MaterialModule, DatePipe, GroupsToStringPipe],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css'
})
export class ExtendedUsersComponent implements OnInit {
  usersService = inject(UsersService);
  confirmService = inject(ConfirmService);

  users: User[] = [];
  columnsToDisplay = ['id', 'name', 'email', 'lastLogin', 'active', 'groups', 'permissions', 'actions'];

  ngOnInit(): void {
    this.loadUsers();
  } 
  
  loadUsers() {
    this.usersService.getExtendedUsers().subscribe(users => {
      this.users = users;
    });
  }

  onDelete(user: User) {
    this.confirmService.confirm({
      title: 'Deleting user',
      question: 'Do you really want to delete user ' + user.name + '?'
    }).subscribe(answer => {
      if (answer) {
        this.usersService.deleteUser(user.id!).subscribe(success => {
          this.loadUsers();
        });     
      }
    });
  }
}
