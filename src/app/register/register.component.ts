import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hide = true;
  passwordMessage = '';
  
  passwordValidator = (model: AbstractControl): ValidationErrors | null => {
    const result = zxcvbn(model.value);
    this.passwordMessage = "Password score: " + result.score +" of 4, breakable in " + result.crackTimesDisplay.offlineSlowHashing1e4PerSecond;
    
    if (result.score > 2) {
      return null;
    }
    return {weakPassword: this.passwordMessage};
  }
  registerForm = new FormGroup({
    login: new FormControl('',[Validators.required, Validators.minLength(3)]),
    email: new FormControl('',[Validators.required, 
                               Validators.email, 
                      Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")]),
    password: new FormControl('', this.passwordValidator),
    password2: new FormControl('')
  });

  constructor(){
    const options = {
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    }
    zxcvbnOptions.setOptions(options);
  }



  submit() {

  }

  get login():FormControl<string> {
    return this.registerForm.get('login') as FormControl<string>;
  }
  get password():FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>;
  }
}
