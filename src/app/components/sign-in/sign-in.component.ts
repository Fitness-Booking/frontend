import { AuthService } from '../../shared/service/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html',
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/home']);
    }
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.signIn(this.f.username.value, this.f.password.value)
      .pipe(first()) // assuming you only want to take the first emitted value
      .subscribe(
        (result) => {
          console.log(result);
          if (!(result && result.access_token)) {
            this.error = 'Failed to login. Please check your credentials.';
            this.loading = false; // stop loading
            return;
          }
          localStorage.setItem('access_token', result.access_token);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.error = 'Failed to login. Please check your credentials.';
          this.loading = false; // stop loading
        }
      );
  }

  signUp() {
    this.router.navigate(['sign-up']);
  }
}
