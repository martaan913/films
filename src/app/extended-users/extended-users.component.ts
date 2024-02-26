import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-extended-users',
  standalone: true,
  imports: [],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css'
})
export class ExtendedUsersComponent implements OnInit {
  usersService = inject(UsersService);

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(users => {
      console.log("Users:", users);
    });
  }  
}
