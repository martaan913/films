import { AfterViewInit, Component, inject, viewChild } from '@angular/core';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films.service';
import { UsersService } from '../../services/users.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent implements AfterViewInit {
  filmsService = inject(FilmsService);
  usersService = inject(UsersService);
  films: Film[] = [];
  columnsToDisplay = ['id', 'nazov', 'rok'];

  ngAfterViewInit(): void {
    this.filmsService.getFilms().subscribe(filmsResponse => {
      console.log(filmsResponse);
      this.films = filmsResponse.items;
    })
  }
}
