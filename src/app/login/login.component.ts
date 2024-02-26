import { Component, inject } from '@angular/core';

import { Auth } from '../../entities/auth';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = true;
  auth = new Auth('Peter','sovy');
  usersService = inject(UsersService);
  router = inject(Router);

  submit() {
    this.usersService.login(this.auth).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/extended-users');
      }
    });
  }
}
