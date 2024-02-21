import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = "http://localhost:8080/";
  private users:User[]=[new User('Hanka Service','hanka@upjs.sk', 2, new Date(),'qwerty'),
                new User('Julka Service', 'julka@upjs.sk', 3, undefined, 'heslo')];
  
  constructor(private http: HttpClient) { }

  getUsersSynchronous(): User[] {
    return this.users;
  }

  getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map(jsonUsers => jsonUsers.map(jsonUser => User.clone(jsonUser)))
    );
  }
}
