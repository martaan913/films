import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { EMPTY, map, of, switchMap, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  userId? :number;
  user = new User('','');
  hide = true;
  editForm = new FormGroup({
    login: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3)],
      // asyncValidators: this.userConfictsValidator('login')
    }),
    email: new FormControl('',[Validators.required, 
                               Validators.email, 
                      Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")]),//, this.userConfictsValidator('email')),
    password: new FormControl(''),
    active: new FormControl(true)
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      tap(id => this.userId = id),
      switchMap(id => id ? this.usersService.getUser(id): of(new User('','')))
    ).subscribe(user => {
      this.user = user;
      this.editForm.patchValue({
        login: user.name,
        email: user.email,
        password: '',
        active: user.active
      });
    });

    // this.userId = Number(this.route.snapshot.params['id']);
  }

  submit() {

  }

  get login():FormControl<string> {
    return this.editForm.get('login') as FormControl<string>;
  }
  get email():FormControl<string> {
    return this.editForm.get('email') as FormControl<string>;
  }
  get password():FormControl<string> {
    return this.editForm.get('password') as FormControl<string>;
  }
}
