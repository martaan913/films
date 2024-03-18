import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Film } from '../entities/film';
import { UsersService } from './users.service';

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  usersService = inject(UsersService);
  http = inject(HttpClient);
  url = "http://localhost:8080/";


  getFilms(): Observable<FilmsResponse> {
    return this.http.get<FilmsResponse>(this.url + 'films');
  }
}
