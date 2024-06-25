import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import {
  EMPTY,
  Observable,
  of,
  switchMap,
  tap,
  catchError,
  distinctUntilChanged,
  debounceTime,
  map,
  takeUntil
} from 'rxjs';
import { FilmsService } from '../../services/films.service';
import { Film } from '../../entities/film';
import { Postava } from '../../entities/postava';
import {
  AbstractControl,
  FormArray, FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Person } from "../../entities/person";
import { MatSelect } from "@angular/material/select";
import {MatTableDataSource} from "@angular/material/table";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-edit-film',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule, FormsModule, MatSelect],
  templateUrl: './edit-film.component.html',
  styleUrls: ['./edit-film.component.css']
})
export class EditFilmComponent implements OnInit {
  route = inject(ActivatedRoute);
  filmsService = inject(FilmsService);
  fb = inject(FormBuilder);
  filmId?: number;
  film = new Film('', 0, '', '', [], [], {});
  editForm = this.fb.group({
    nazov: ['', [Validators.required, Validators.minLength(1)]],
    rok: [2020, Validators.required],
    slovenskyNazov: ['', Validators.required],
    imdbID: ['', Validators.required],
    poradieVRebricku: this.fb.group({
      afi1998Control: [''],
      afi2007Control: ['']
    }),
    reziser: this.fb.array([]),
    postavy: this.fb.array([])
  });
  searchControl = new FormControl();
  searchControlPostava = new FormControl();
  filteredDirectors!: Observable<Person[]>;
  filteredCharacters!: Observable<Person[]>;
  directors: Person[] = [];
  characters: Postava[] = [];
  columnsToDisplay = ['herec', 'postava', 'rola', 'actions'];
  columnsToDisplayDirectors = ['meno','actions']
  charactersDataSource = new MatTableDataSource<Postava>()
  directorsDataSource = new MatTableDataSource<Person>()
  selectedDirector?: Person;
  selectedPerson?: Person;
  namePostava = new FormControl()
  selectedRole: any;


  ngOnInit(): void {
    this.route.paramMap
      .pipe(
      switchMap(params => {
        const id = Number(params.get('id')) || undefined;
        this.filmId = id;
        return id ? this.filmsService.getFilm(id) : of(new Film('', 0, '', '', [], [], {}));
      }),
      tap(film => {
        this.film = film;
        console.log("Editing film:", film);
        this.editForm.patchValue({
          nazov: film.nazov,
          rok: film.rok,
          slovenskyNazov: film.slovenskyNazov,
          imdbID: film.imdbID,
          poradieVRebricku: {
            afi1998Control: film.poradieVRebricku['AFI 1998'] ? film.poradieVRebricku['AFI 1998'].toString() : '',
            afi2007Control: film.poradieVRebricku['AFI 2007'] ? film.poradieVRebricku['AFI 2007'].toString() : ''
          }
        });
        this.directors = film.reziser;
        this.directorsDataSource.data = this.directors;
        this.characters = film.postava;
        this.charactersDataSource.data = this.characters;
      })
    ).subscribe();

    this.filteredDirectors = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filmsService.getPerson(value).pipe(
        catchError(err => {
          console.error('Chyba pri načítaní režisérov:', err);
          return of([]);
        })
      ))
    );

    this.filteredCharacters = this.searchControlPostava.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filmsService.getPerson(value).pipe(
        catchError(err => {
          console.error('Chyba pri načítaní postáv:', err);
          return of([]);
        })
      ))
    );
    this.selectedRole = 'vedľajšia postava';
  }


  onDirectorSelected(event: any): void {
    const selectedDirectorName = event.option.value;
    this.filteredDirectors.pipe(
      map(directors => directors.find(director =>
        `${director.krstneMeno} ${director.priezvisko}` === selectedDirectorName))
    ).subscribe(director => {
      this.selectedDirector = director;
    });
    console.log(event.option.value);
  }

  onAddDirector(): void {
    console.log(this.selectedDirector?.krstneMeno);
    if (this.selectedDirector) {
      this.addDirector(this.selectedDirector);
      this.selectedDirector = undefined;
    }
  }

  addDirector(director: Person): void {
    this.directors.push(director);
    this.directorsDataSource.data = this.directors;
  }

  submit() {
    this.film.nazov = this.nazov.value.trim();
    this.film.rok = Number(this.rok.value);
    this.film.slovenskyNazov = this.slovenskyNazov.value.trim();
    this.film.imdbID = this.imdbID.value.trim();
    this.film.reziser = this.directors;
    this.film.poradieVRebricku = {
      'AFI 1998': this.poradieVRebricku.get('afi1998Control')!.value,
      'AFI 2007': this.poradieVRebricku.get('afi2007Control')!.value
    };
    this.filmsService.saveFilm(this.film).subscribe(
      response => {
        console.log('Film saved successfully:', response);
      },
      error => {
        console.error('Error saving film:', error);
      }
    );
  }

  onDelete(director: Person): void {
    const index = this.directors.indexOf(director);
    if (index >= 0) {
      this.directors.splice(index, 1);
      this.directorsDataSource.data = [...this.directors]; // Update the dataSource with a new array reference
    }
  }

  get nazov(): FormControl<string> {
    return this.editForm.get('nazov') as FormControl<string>;
  }
  get rok(): FormControl<number> {
    return this.editForm.get('rok') as FormControl<number>;
  }
  get slovenskyNazov(): FormControl<string> {
    return this.editForm.get('slovenskyNazov') as FormControl<string>;
  }
  get poradieVRebricku(): FormGroup {
    return this.editForm.get('poradieVRebricku') as FormGroup;
  }
  get imdbID(): FormControl<string> {
    return this.editForm.get('imdbID') as FormControl<string>;
  }
  get reziser(): FormArray {
    return this.editForm.get('reziser') as FormArray;
  }

  onAddCharacter() {
    if (this.selectedPerson) {
      this.addCharacter(this.selectedPerson);
      this.selectedDirector = undefined;
    }
  }

  private addCharacter(selectedPerson: Person) {
    const newCharacter = new Postava(this.namePostava.value, this.selectedRole, selectedPerson);
    if (!this.characters) {
      this.characters = [];
    }
    this.characters.push(newCharacter);
    this.charactersDataSource.data = [...this.characters];
  }

  onCharacterSelected(event: any): void {
    const selectedPersonName = event.option.value;
    this.filteredCharacters.pipe(
      map(persons => persons.find(person =>
        `${person.krstneMeno} ${person.priezvisko}` === selectedPersonName))
    ).subscribe(person => {
      this.selectedPerson = person;
    });
  }

  onDeleteCharacter(character: Postava) {
    const index = this.characters.indexOf(character);
    if (index >= 0) {
      this.characters.splice(index, 1);
      this.charactersDataSource.data = [...this.characters]; // Update the dataSource with a new array reference
    }
  }
}
