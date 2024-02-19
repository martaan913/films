import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../entities/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users:User[]=[new User('Hanka','hanka@upjs.sk', 2, new Date(),'qwerty'),
                new User('Julka', 'julka@upjs.sk', 3, undefined, 'heslo'),
                {name:"Ferko", email:'ferko@gmail.com', password:''}];
  selectedUser?: User;

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
