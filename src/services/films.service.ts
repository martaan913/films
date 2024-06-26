import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {Observable, catchError, map, throwError, tap} from 'rxjs';
import { Film } from '../entities/film';
import { UsersService } from './users.service';
import { environment } from '../environments/environment';
import {Person} from "../entities/person";
import {MessageService} from "./message.service";
import {Router} from "@angular/router";

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  messageService = inject(MessageService);
  usersService = inject(UsersService);
  router = inject(Router);
  http = inject(HttpClient);
  url = environment.serverUrl;

  get token(): string {
    return localStorage.getItem('filmsToken') || '';
  }

  private set token(value: string) {
    if (value)
      localStorage.setItem('filmsToken', value);
    else
      localStorage.removeItem('filmsToken');
  }

  getTokenHeader(): {headers?: {[header: string]: string},
                     params?: HttpParams} | undefined {
    if (!this.token) {
      return undefined;
    }
    return { headers: {'X-Auth-Token': this.token}};
  }

  getFilms(orderBy?:string, descending?: boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = { ...(options || {}), params: new HttpParams()};
    }
    if (options && options.params) {
      if (orderBy) {
        options.params = options.params.set('orderBy', orderBy);
      }
      if (descending) {
        options.params = options.params.set('descending', descending);
      }
      if (indexFrom) {
        options.params = options.params.set('indexFrom', indexFrom);
      }
      if (indexTo) {
        options.params = options.params.set('indexTo', indexTo);
      }
      if (search) {
        options.params = options.params.set('search', search);
      }
    }
    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError(err => this.usersService.processError(err))
    );
  }

  getFilm(filmId: number): Observable<Film> {
    const token = this.token;

    const headers = new HttpHeaders({
      'X-Auth-Token': token
    });

    return this.http.get<Film>(this.url + 'films/' + filmId, { headers }).pipe(
      map(jsonFilm => Film.clone(jsonFilm)
      ),
      catchError(err => this.usersService.processError(err))
    );
  }

  getPerson(searchQuery: string): Observable<Person[]> {
    const token = this.token; // Získajte token z AuthService alebo odkiaľkoľvek iného miesta, kde je uložený

    // Nastavenie hlavičiek s tokenom
    const headers = new HttpHeaders({
      'X-Auth-Token': token
    });

    // Vykonajte HTTP GET požiadavku na server
    return this.http.get<Person[]>(this.url + 'search-person/' + searchQuery, { headers }).pipe(
      catchError(error => {
        console.error('Chyba pri načítaní režisérov:', error);
        return throwError('Chyba pri načítaní režisérov. Skúste to prosím znova neskôr.'); // Ošetrenie chyby
      })
    );
  }

  saveFilm(film: Film): Observable<Film> {
    const token = this.token; // Získajte token z AuthService alebo odkiaľkoľvek iného miesta, kde je uložený

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': token
    });

    return this.http.post<Film>(this.url + 'films/', film, {headers}).pipe(
      map((jsonFilm) => Film.clone(jsonFilm)),
      tap((user) =>
        this.messageService.success('Film ' + film.nazov + ' saved successfully')
      ),
      tap((user) => this.router.navigateByUrl('/films')),
      catchError((err) => this.usersService.processError(err))
    );
  }
}
