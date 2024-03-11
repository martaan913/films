import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { RegisterComponent } from './register/register.component';
import { EditUserComponent } from './edit-user/edit-user.component';

export const routes: Routes = [
  {path: 'users', component: UsersComponent},
  {path: 'extended-users', component: ExtendedUsersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user/edit/:id', component: EditUserComponent, data: {daco : 1}},
  {path: 'user/new', component: EditUserComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
