import { Roles } from './../../model/enums/roles.enum';
import { AuthService } from '../../shared/service/user.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
    role: new FormControl('')
  });
  roles: Array<string> = [];
  loading = false;
  submitted = false;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    for (const value in Roles) {
      if (typeof Roles[value] === 'number') { this.roles.push(value); }
    }
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      role: [this.roles[1]]
    },
    {validator: this.checkPasswords('password', 'repeatPassword')}
    );
  }
  checkPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notSame: true});
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    };
  }
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.signUp(this.f.email.value, this.f.username.value, this.f.password.value, this.f.repeatPassword.value, +Roles[this.f.role.value]
    ).subscribe(
      (result) => {
        // Handle successful registration
        if(!(result && result.access_token)) {
          this.error = 'Failed to register. Please check your credentials.';
          this.loading = false;
          return;
        }
        localStorage.setItem('access_token', result.access_token);
        this.router.navigate(['/home']);
        this.loading = false;
      },
      (error) => {
        this.error = error;
        this.loading = false;
      }
    );
  }
}
